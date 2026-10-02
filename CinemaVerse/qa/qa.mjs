const route = async (page, hash, waitFor) => {
  await page.goto(`http://localhost:4188/#${hash}`)
  if (waitFor) await page.waitForSelector(waitFor, { timeout: 8000 })
  await page.waitForTimeout(350)
}

export default async function run(page, ui) {
  const report = {}
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text().slice(0, 220))
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${String(error).slice(0, 220)}`))

  const missingImages = async () =>
    page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute('src'))
        .slice(0, 6),
    )

  // 1 — home
  await route(page, '/', '.hero')
  report.home = {
    heroTitle: await page.locator('.hero__title').innerText(),
    rails: await page.locator('.rail').count(),
    cards: await page.locator('.card').count(),
    navLinks: await page.locator('.header__nav .navlink').count(),
    broken: await missingImages(),
  }

  // 2 — movies + filters + sort + pagination
  await route(page, '/movies?sort=rating&minRating=8', '.card')
  report.movies = {
    heading: await page.locator('.page-head__title').innerText(),
    cards: await page.locator('.card').count(),
    chips: await page.locator('.active-filters .tag').allInnerTexts(),
    pagination: await page.locator('.pagination__page').count(),
    facets: await page.locator('.facet').count(),
    firstTitle: await page.locator('.card__title').first().innerText(),
    broken: await missingImages(),
  }

  // 3 — genre tile → genre detail (locked facet)
  await route(page, '/genres', '.gentile')
  report.genres = {
    heading: await page.locator('.page-head__title').innerText(),
    tiles: await page.locator('.gentile').count(),
  }
  await page.locator('.gentile__link').first().click()
  await page.waitForSelector('.browse__results .card', { timeout: 8000 })
  report.genreDetail = {
    hash: await page.evaluate(() => window.location.hash),
    heading: await page.locator('.page-head__title').innerText(),
    lockedTag: await page.locator('.tag--locked').innerText(),
    genreFacetHidden: (await page.locator('.facet__head', { hasText: 'Genre' }).count()) === 0,
    cards: await page.locator('.card').count(),
  }

  // 4 — country detail
  await route(page, '/country/Japan', '.card')
  report.country = {
    heading: await page.locator('.page-head__title').innerText(),
    lockedTag: await page.locator('.tag--locked').innerText(),
    cards: await page.locator('.card').count(),
  }

  // 5 — search
  await route(page, '/search?q=space', '.card, .empty')
  await page.waitForTimeout(400)
  report.search = {
    summary: (await page.locator('.searchpage__summary h2').count())
      ? await page.locator('.searchpage__summary h2').innerText()
      : 'none',
    cards: await page.locator('.card').count(),
  }

  // 6 — header instant suggestions
  await route(page, '/', '.hero')
  await page.locator('.searchbox__form input').fill('noir')
  await page.waitForSelector('.suggest__row', { timeout: 8000 })
  report.suggest = {
    rows: await page.locator('.suggest__row').count(),
    first: await page.locator('.suggest__label').first().innerText(),
  }
  await page.keyboard.press('Enter')
  await page.waitForTimeout(600)
  report.afterSuggestEnter = await page.evaluate(() => window.location.hash)

  // 7 — movie detail + watchlist + history
  await route(page, '/trending', '.card')
  await page.locator('.card__link').first().click()
  await page.waitForSelector('.detail__title', { timeout: 8000 })
  const detailTitle = await page.locator('.detail__title').innerText()
  report.detail = {
    title: detailTitle,
    facts: await page.locator('.detail__facts li').count(),
    specRows: await page.locator('.spec__row').count(),
    related: await page.locator('.rail').count(),
    tabs: await page.locator('.detail__tab').count(),
  }
  await page.locator('.detail__tab', { hasText: 'Cast & crew' }).click()
  await page.waitForTimeout(250)
  report.detail.cast = await page.locator('.cast li').count()

  await page.locator('.detail__actions button').first().click()
  await page.waitForTimeout(250)
  report.detail.savedLabel = await page.locator('.detail__actions button').first().innerText()
  report.badgeAfterSave = await page.locator('.iconlink__badge').first().innerText()

  // 8 — watchlist page
  await route(page, '/watchlist', '.card, .empty')
  report.watchlist = {
    heading: await page.locator('.page-head__title').innerText(),
    cards: await page.locator('.card').count(),
    statLine: await page.locator('.page-head__description').innerText(),
  }

  // 9 — history page
  await route(page, '/history', '.timeline__row, .empty')
  report.history = {
    heading: await page.locator('.page-head__title').innerText(),
    rows: await page.locator('.timeline__row').count(),
  }

  // 10 — profile + persistence
  await route(page, '/profile', '.profile__avatar')
  await page.locator('.field input').first().fill('Film Buff')
  await page.locator('button', { hasText: 'Save details' }).click()
  await page.waitForTimeout(250)
  report.profile = {
    heading: await page.locator('.page-head__title').innerText(),
    storedName: await page.evaluate(() => window.localStorage.getItem('cinemaverse:profile')?.slice(0, 80)),
    storedWatchlist: await page.evaluate(() => window.localStorage.getItem('cinemaverse:watchlist')),
  }

  // 11 — 404
  await route(page, '/definitely-not-a-page', '.notfound')
  report.notFound = { code: await page.locator('.notfound__code').innerText() }

  // 12 — persistence across reload
  await route(page, '/profile', '.profile__avatar')
  report.afterReload = {
    heading: await page.locator('.page-head__title').innerText(),
    historyBadge: await page.evaluate(() => window.localStorage.getItem('cinemaverse:history')?.slice(0, 40)),
  }

  report.consoleErrors = errors.slice(0, 12)
  return report
}
