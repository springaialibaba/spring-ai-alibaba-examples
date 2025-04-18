insert into Authors (firstName, lastName) values ('Craig', 'Walls');
insert into Authors (firstName, lastName) values ('Josh', 'Long');
insert into Authors (firstName, lastName) values ('Ken', 'Kousen');
insert into Authors (firstName, lastName) values ('Venkat', 'Subramaniam');

insert into Publishers (name) values ('Manning Publications');
insert into Publishers (name) values ('OReilly Media');
insert into Publishers (name) values ('Pragmatic Bookshelf');

insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781617292545', 'Spring Boot in Action', 1, 1);
insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781617297571', 'Spring in Action', 1, 1);
insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781680507256', 'Build Talking Apps for Alexa', 1, 3);
insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781934356401', 'Modular Java', 1, 3);

insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781449374648', 'Cloud Native Java', 2, 2);

insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781680508222', 'Help Your Boss Help You', 3, 3);
insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781492046677', 'Kotlin Cookbook', 3, 2);

insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781680509816', 'Cruising Along with Java', 4, 3);
insert into Books (isbn, title, author_ref, publisher_ref)
values ('9781680506358', 'Programming Kotlin', 4, 3);
