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
  - [x] make Complete By field date picker to create new events
  - [x] update existing events
  - [ ] keep track of user defined status (use bubbles)
- [x] Create schools dashboard
  - [x] school name, list, app type, deadline, # supplements
  - [x] make list and app. type columns with Select components to update list entries
- [x] UI scaffolding
  - [x] Home Page, Search Page, My Lists + Calendar (pass auth as props + auth protect pages)
  - [x] Nav bar
- [x] Calelndar page
  - [x] Toggle between event creation form and calendar
  - [x] Filter calendar events with same filters as dashboard
  - [x] Use shadcn/ui date picker with time for event creation
- [ ] Schools page
  - [x] Populate select field if school already in a list, update list if on select onchange (like in dashboard)
  - [x] Infinite scroll of schools
  - [ ] School image
  - [ ] Schoo link?
- [ ] Home / Landing Page
  - [ ] make only public page
- [ ] Tidying up UI + Extras
  - [x] Dark mode
- [ ] Improved Calendar functionality
  - [ ] drag & drop in calendar updates calendar event
  - [ ] edit calendar event directly in calendar
  - [ ] Google Calendar & Apple Calendar integration
- [ ] Deploy
- [ ] Create scraper

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
