-- CreateTable
CREATE TABLE `Hazard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(120) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('TICKS', 'POISON', 'AGGRESSIVE_DOG', 'BROKEN_GLASS', 'OTHER') NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    `lat` DECIMAL(9, 6) NOT NULL,
    `lng` DECIMAL(9, 6) NOT NULL,
    `address` VARCHAR(255) NULL,
    `reportedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolvedAt` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Hazard_lat_lng_idx`(`lat`, `lng`),
    INDEX `Hazard_category_status_reportedAt_idx`(`category`, `status`, `reportedAt`),
    INDEX `Hazard_userId_reportedAt_idx`(`userId`, `reportedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hazard` ADD CONSTRAINT `Hazard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
