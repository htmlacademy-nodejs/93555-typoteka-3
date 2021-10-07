INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg'),
('sidorov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Сидор', 'Сидоров', 'avatar3.jpg');

INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
('Ёлки. История деревьев', 'Ёлки — это не просто красивое дерево.', 'Ёлки — это не просто красивое дерево. Это прочная древесина.', 'image1.jpg', 1),
('Лучше рок-музыканты 20-века', 'Альбом стал настоящим открытием года.', 'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.','image2.jpg', 2),
('Как достигнуть успеха не вставая с кресла', 'Этот смартфон — настоящая находка.', 'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.', 'image3.jpg', 2),
('Учим HTML и CSS', 'Освоить вёрстку несложно.', 'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.', 'image4.jpg', 3),
('Как начать программировать', 'Программировать не настолько сложно', 'Программировать не настолько сложно, как об этом говорят.', 'image5.jpg', 3);
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(4, 1),
(5, 3);
ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id) VALUES
('Это где ж такие красоты?', 1, 1),
('Совсем немного...', 2, 3),
('Согласен с автором!', 2, 4),
('Мне кажется или я уже читал это где-то?', 3, 2),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 3, 5),
('Планируете записать видосик на эту тему?', 3, 1);
ALTER TABLE comments ENABLE TRIGGER ALL;
