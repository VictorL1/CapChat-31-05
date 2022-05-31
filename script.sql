-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mar. 31 mai 2022 à 12:42
-- Version du serveur :  5.7.34
-- Version de PHP : 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `CapChat`
--

-- --------------------------------------------------------

--
-- Structure de la table `artiste`
--

CREATE TABLE `artiste` (
  `IDartiste` int(11) NOT NULL,
  `NomArtiste` varchar(25) NOT NULL,
  `MDP` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `artiste`
--

INSERT INTO `artiste` (`IDartiste`, `NomArtiste`, `MDP`) VALUES
(1, 'Jonathan', 'Jojo123!'),
(2, 'Victor', 'Vicou19?'),
(6, 'test', '85b3c344b71efa0ea687b18a1f1db7203e44c204462bba256d0e8f0fc7fd8222db5e1b845246d8aa3e4c09859d0fd80c5fe0355fa8b5e59d5e6b7ac79cf7df16'),
(7, 'lapin', '03c5b9979ceaa218678b7a3087276cfcb669898e9b965b2f23b92b085af5ca8d707ac24ee4eb496ffc2e9aa3d9dcf808ce341ceaf765d122ae476bed0ede9713'),
(8, 'arun', '0b9f31180874d44e5490a2a3e27d0f4bf1c52af4a0cd767be1b82de6fdf73b2f8af1e7f4a3b5abed3869d51d4f627f6c243428e3239491250455a849c481df35'),
(9, 'yolo', '1e008cefd170e689a8b62a86598f8f5aabb9733fe3b344e437021d0b659c2a9f82e4780ac95d590c21c7c5f54c440428eb65b8faae8858794243395374012ba0'),
(10, 'youpi', '0338f90742c27fbc249c4aa03c061cde82847795f1dca8a04fa0a847080b63c029e88fdbb1e1956b2d5135f0e728e21d9cee62ec6472a6aa45db95ee6725ac4a');

-- --------------------------------------------------------

--
-- Structure de la table `image`
--

CREATE TABLE `image` (
  `IDimage` int(11) NOT NULL,
  `NomImage` varchar(25) NOT NULL,
  `img_blob` longblob,
  `TexteQuestion` varchar(100) NOT NULL,
  `ImageSinguliere` tinyint(1) DEFAULT NULL,
  `IdJeu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `image`
--

INSERT INTO `image` (`IDimage`, `NomImage`, `img_blob`, `TexteQuestion`, `ImageSinguliere`, `IdJeu`) VALUES
(1, 'test', NULL, 'test question', 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `jeu`
--

CREATE TABLE `jeu` (
  `IDJeu` int(11) NOT NULL,
  `NomJeu` varchar(25) NOT NULL,
  `urlJeu` varchar(50) NOT NULL,
  `IdArtiste` int(11) DEFAULT NULL,
  `IdTheme` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `jeu`
--

INSERT INTO `jeu` (`IDJeu`, `NomJeu`, `urlJeu`, `IdArtiste`, `IdTheme`) VALUES
(3, 'put_jeu', 'trest', 1, 1),
(4, 'undefined', 'undefined', NULL, NULL),
(5, 'undefined', 'undefined', NULL, NULL),
(6, 'undefined', 'undefined', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `theme`
--

CREATE TABLE `theme` (
  `IDtheme` int(11) NOT NULL,
  `NomTheme` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `theme`
--

INSERT INTO `theme` (`IDtheme`, `NomTheme`) VALUES
(1, 'Animaux'),
(2, 'Outils');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `artiste`
--
ALTER TABLE `artiste`
  ADD PRIMARY KEY (`IDartiste`);

--
-- Index pour la table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`IDimage`),
  ADD KEY `FK_JEU` (`IdJeu`);

--
-- Index pour la table `jeu`
--
ALTER TABLE `jeu`
  ADD PRIMARY KEY (`IDJeu`),
  ADD KEY `FK_ARTISTE` (`IdArtiste`),
  ADD KEY `FK_THEME` (`IdTheme`);

--
-- Index pour la table `theme`
--
ALTER TABLE `theme`
  ADD PRIMARY KEY (`IDtheme`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `artiste`
--
ALTER TABLE `artiste`
  MODIFY `IDartiste` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `jeu`
--
ALTER TABLE `jeu`
  MODIFY `IDJeu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `FK_JEU` FOREIGN KEY (`IdJeu`) REFERENCES `jeu` (`IDJeu`);

--
-- Contraintes pour la table `jeu`
--
ALTER TABLE `jeu`
  ADD CONSTRAINT `FK_ARTISTE` FOREIGN KEY (`IdArtiste`) REFERENCES `artiste` (`IDartiste`),
  ADD CONSTRAINT `FK_THEME` FOREIGN KEY (`IdTheme`) REFERENCES `theme` (`IDtheme`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
