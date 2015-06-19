
/* Clean up sermon dates */
update _sermon_date SET SermonDate = REPLACE(SermonDate, '\r', '');
alter table _sermon_date drop `sermon_date`;
alter table _sermon_date add `sermon_date` datetime;
update _sermon_date SET sermon_date = STR_TO_DATE(SermonDate, '%c/%e/%Y %k:%i:%s');

/* Clean up bible books */
update _bible_books SET Book = REPLACE(Book, '\r', '');

/* Clean up keywords */
update _keyword SET Keyword = REPLACE(Keyword, '\r', '');
delete from _keyword where Keyword = '';

/* Add keywords into topics table */
insert ignore into _keyword_topics (keyword)
select distinct(k.Keyword)
from seriesmedia m
	join _sermon_date d ON (DATEDIFF(m.MediaDateTime, d.sermon_date) > -1 AND DATEDIFF(m.MediaDateTime, d.sermon_date) < 2)
	join _sermons s on d.SermonID = s.SermonID
	left join _keyword k on s.SermonID = k.ID
where m.mediatype = 'sermon';

/* Clean up verses */
update _sermon_verse SET Verse = REPLACE(Verse, '\r', '');


select series.SeriesTitle, m.MediaTitle, s.Title AS title, m.MediaDateTime, d.sermon_date, DATEDIFF(m.MediaDateTime, d.sermon_date) as daysDiff, GROUP_CONCAT(DISTINCT(t.topic)) AS topics, GROUP_CONCAT(DISTINCT(t.tags)) AS tags
from seriesmedia m
	join _sermon_date d ON (DATEDIFF(m.MediaDateTime, d.sermon_date) > -1 AND DATEDIFF(m.MediaDateTime, d.sermon_date) < 2)
	join _sermons s on d.SermonID = s.SermonID
	left join series on m.SeriesID = series.SeriesID
	left join (select _keyword.ID, _keyword_topics.topic, _keyword_topics.tags from _keyword JOIN _keyword_topics ON _keyword.keyword = _keyword_topics.keyword) t ON s.SermonID = t.ID
where m.mediatype = 'sermon'
group by m.MediaID;

select count(*) from seriesmedia where mediatype = 'sermon'; /* 364 */



select _keyword.ID, _keyword_topics.topic from _keyword_topics JOIN  _keyword ON _keyword.keyword = _keyword_topics.keyword;
