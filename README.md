## To Do

- [x] User create lists
- [x] Add schools to user lists (~~combobox~~, select)
- [x] Display lists
- [x] Display calendar and fetch user events
- [x] Add calendar events per supplement per school per list
- [x] Filter calendar events by list
- [ ] Create supplements dashboard
  - [x] heading (# of schools in each list, x/y supplements completed)
  - [x] school name, app type, deadline, supplement title, scheduled to complete by, status [Completed, In Progress, Planned]
  - [x] add filtering based school name (search box like main page)
  - [x] add combobox for filteirng by list
  - [x] handle supplement title overflow (possibly school too)
  - [ ] ~~add dialog or hover card over supplement title and display all supplement information~~
  - [ ] potentially make Complete By field date picker (will update exisitng event for supplement or create a new one with new date)
- [ ] Create schools dashboard
  - [x] school name, list, app type, deadline, # supplements
  - [ ] make list cell a select field that populates with list of supplement and makes API to update and change list upon different selection
- [x] UI scaffolding
  - [x] Home Page, Search Page, My Lists + Calendar (pass auth as props + auth protect pages)
  - [x] Nav bar
- [x] Calelndar page
  - [x] Toggle between event creation form and calendar
  - [x] Filter calendar events with same filters as dashboard
  - [x] Use shadcn/ui date picker with time for event creation
- [ ] Schools page
  - [ ] Populate select field if school already in a list, update list if on select onchange (like in dashboard)
  - [ ] Infinite scroll of schools
  - [ ] School image
  - [ ] Schoo link?
- [ ] Home / Landing Page
  - [ ] make only public page
- [ ] Tidying up UI + Extras
  - [x] Dark mode
- [ ] Google Calendar & Apple Calendar integration
- [ ] Deploy
- [ ] Create scraper

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
