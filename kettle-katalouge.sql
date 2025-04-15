-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Värd: localhost:3306
-- Tid vid skapande: 19 feb 2025 kl 21:40
-- Serverversion: 5.7.24
-- PHP-version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `kettle-katalouge`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `album`
--

CREATE TABLE `album` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `album`
--

INSERT INTO `album` (`id`, `title`, `user_id`) VALUES
(2, 'All things not Kettles', 2),
(3, 'User 1\'s album', 1),
(4, 'Album nr 4', 2),
(6, 'Zeroes of Middle Earth', 3);

-- --------------------------------------------------------

--
-- Tabellstruktur `photo`
--

CREATE TABLE `photo` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `photo`
--

INSERT INTO `photo` (`id`, `title`, `url`, `comment`, `user_id`) VALUES
(2, 'My Kettle #2', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'Not as good as the first one, but hey!', 2),
(3, 'Crappy Kettle', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'Atleast it\'s a Kettle.', 2),
(4, 'A Mouse, and not a Kettle', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'Too bad it\'s not a Kettle.', 2),
(5, 'Some stuff', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'Still not a Kettle', 2),
(6, 'Sunny day', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'Without a Kettle :(', 2),
(7, 'This has nothing to do with other user', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'unrelated photo', 1),
(8, 'Photo for album 4', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'comment bcuz', 2),
(9, 'Photo 4 album 4', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'comment bcuz', 2),
(10, 'Photo nr 10 album 4', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff32', 'comment bcuz', 2),
(11, 'Freakin\' Frodo', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff37', 'Thinks he can withstand the ring', 3),
(12, 'Stupid Sam', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff42', 'Why can\'t I have friends?', 3),
(14, 'Sexy Aragorn', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff42', 'So cool, no wonder he doesn\'t like me', 3);

-- --------------------------------------------------------

--
-- Tabellstruktur `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `user`
--

INSERT INTO `user` (`id`, `email`, `first_name`, `last_name`, `password`) VALUES
(1, 'user@email.com', 'Kettle', 'Wulf', '$2b$10$nTDjduHtqDO9toZImWZuGeqeoIWYz1cfATe6jY5yx.kYESE9Manxa'),
(2, 'olle@hotmail.com', 'Olle', 'Wistedt', '$2b$10$kfXnyW4py4flVXnP8Rmwp.2KxqZcTkAM9tIR5bPzz5obpGDj9qua6'),
(3, 'oneusertorulethemall@tolkien.jrr', 'Sauron', 'Annatar', '$2b$10$t1uj3/s9N7jbIXBto/w1oOLKekMInch/j71usMiVkzV.WDcjLJ7ES');

-- --------------------------------------------------------

--
-- Tabellstruktur `_albumtophoto`
--

CREATE TABLE `_albumtophoto` (
  `A` int(10) UNSIGNED NOT NULL,
  `B` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `_albumtophoto`
--

INSERT INTO `_albumtophoto` (`A`, `B`) VALUES
(2, 2),
(4, 2),
(4, 3),
(2, 4),
(2, 6),
(4, 6),
(3, 7),
(4, 8),
(4, 9),
(4, 10),
(6, 11),
(6, 12),
(6, 14);

-- --------------------------------------------------------

--
-- Tabellstruktur `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('078aa95d-44ec-4340-a895-3c017af8d974', 'b4ff49261c9153efaae7b5583a29c4b7ce6496888cbcdc9ef5203355cd9cc07f', '2025-02-13 14:59:57.672', '20250213145957_added_album_model', NULL, NULL, '2025-02-13 14:59:57.653', 1),
('6798ff9d-d5ab-4d4b-ace5-c5e0378f4f6c', 'bb1b693fdcb8bc89eb255e15cc58462e284c7af3e8b14ff7f74e0e72a5fccc20', '2025-02-18 22:33:41.584', '20250218223341_added_relations_between_models', NULL, NULL, '2025-02-18 22:33:41.269', 1),
('955e062e-f5da-4007-b37b-b16ed04d130f', '17711e826077bbe558b558593c67705d5b763747c26c90bf0175541de9d05300', '2025-02-18 23:41:25.950', '20250218234125_renamed_user_relation', NULL, NULL, '2025-02-18 23:41:25.843', 1),
('9e10a993-7787-4d43-b92b-9acf490f94a6', '021cf8cbd47839c7d5c739a37b4f4f2f10895e344e8c9a285935b5d588911191', '2025-02-13 15:02:47.082', '20250213150247_added_photo_model', NULL, NULL, '2025-02-13 15:02:47.058', 1),
('a41c5e9c-10a3-45ce-a9a8-ff6b683f61d3', 'bfa6f2754fcfae5e3146e9f9b5f77822df46fa80ea351f9c7754acf075fd45e6', '2025-02-13 16:19:29.289', '20250213161929_added_password_to_user', NULL, NULL, '2025-02-13 16:19:29.262', 1),
('b65a59ae-db25-45c4-b0a1-c2358440edd5', '31cc68958c5f15faa8f61019458b9b8b824249178e706ac8c8d6a873d2dfd160', '2025-02-13 14:55:31.313', '20250213145531_added_user_model', NULL, NULL, '2025-02-13 14:55:31.295', 1);

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Album_user_id_fkey` (`user_id`);

--
-- Index för tabell `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Photo_user_id_fkey` (`user_id`);

--
-- Index för tabell `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Index för tabell `_albumtophoto`
--
ALTER TABLE `_albumtophoto`
  ADD UNIQUE KEY `_AlbumToPhoto_AB_unique` (`A`,`B`),
  ADD KEY `_AlbumToPhoto_B_index` (`B`);

--
-- Index för tabell `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `album`
--
ALTER TABLE `album`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT för tabell `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT för tabell `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `Album_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restriktioner för tabell `photo`
--
ALTER TABLE `photo`
  ADD CONSTRAINT `Photo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restriktioner för tabell `_albumtophoto`
--
ALTER TABLE `_albumtophoto`
  ADD CONSTRAINT `_AlbumToPhoto_A_fkey` FOREIGN KEY (`A`) REFERENCES `album` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_AlbumToPhoto_B_fkey` FOREIGN KEY (`B`) REFERENCES `photo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
