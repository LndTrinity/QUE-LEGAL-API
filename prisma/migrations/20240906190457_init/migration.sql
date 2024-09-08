-- CreateTable
CREATE TABLE `tipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `tamanho` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `quantidade` INTEGER NOT NULL,
    `tipoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fotos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(30) NOT NULL,
    `codigoFoto` LONGTEXT NOT NULL,
    `produtoid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `tipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fotos` ADD CONSTRAINT `fotos_produtoid_fkey` FOREIGN KEY (`produtoid`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
