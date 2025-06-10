## To Do

- [x] User create lists
- [x] Add schools to user lists (~~combobox~~, select)
- [x] Display lists
- [x] Display calendar and fetch user events
- [x] Add calendar events per supplement per school per list
- [x] Filter calendar events by list
- [ ] Create dashboard of all required supplements
  - [ ] heading (# of schools in each list, x/y supplements completed)
  - [x] school name, app type, deadline, supplement title, scheduled to complete by, status [Completed, In Progress, Planned]
  - [x] add filtering based school name (search box like main page)
  - [ ] add combobox for filteirng by list
  - [ ] handle supplement title overflow (possibly school too)
  - [ ] add dialog or hover card over supplement title and display all supplement information
  - [ ] potentially make Complete By field date picker (will update exisitng event for supplement or create a new one with new date)
- [x] UI scaffolding
  - [x] Home Page, Search Page, My Lists + Calendar (pass auth as props + auth protect pages)
  - [x] Nav bar
- [ ] Tidying up UI + Extras
  - [ ] Infinite scroll of schools in search
  - [ ] Filter calendar events by school
  - [ ] Use shadcn/ui date picker with time for event creation
  - [ ] TBD
- [ ] Google Calendar & Apple Calendar integration
- [ ] Deploy
- [ ] Create scraper

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
