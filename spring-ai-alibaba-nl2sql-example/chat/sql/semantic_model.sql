SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for semantic_model
-- ----------------------------
DROP TABLE IF EXISTS `semantic_model`;
CREATE TABLE `semantic_model`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `field_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '智能体字段名称',
  `synonyms` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '字段名称同义词',
  `data_set_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '数据集id',
  `origin_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '原始字段名',
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '字段描述',
  `origin_description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '原始字段描述',
  `type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '字段类型 (integer, varchar....)',
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_recall` tinyint NULL DEFAULT 1 COMMENT '0 停用 1 启用',
  `status` tinyint NULL DEFAULT 1 COMMENT '0 停用 1 启用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of semantic_model
-- ----------------------------
INSERT INTO `semantic_model` VALUES (26, 'exampleField1', 'example, sample, demo', 'dataset_001', 'original_example', 'This is an example field.', 'Original description of example field.', 'varchar', '2025-07-23 16:08:07', '2025-07-23 16:10:37', 1, 0);
INSERT INTO `semantic_model` VALUES (27, 'exampleField1', 'example, sample, demo', 'dataset_001', 'original_example1', 'This is an example field.', 'Original description of example field 1.', 'varchar', '2025-07-23 16:09:27', '2025-07-23 16:10:37', 1, 0);
INSERT INTO `semantic_model` VALUES (28, 'exampleField2', 'example, sample, demo', 'dataset_002', 'original_example2', 'This is another example field.', 'Original description of example field 2.', 'integer', '2025-07-23 16:09:27', '2025-07-23 16:10:37', 1, 0);
INSERT INTO `semantic_model` VALUES (29, '1exampleField1', '1example, sample, demo', '1dataset_001', '1original_example', '1his is an example field.', '1Original description of example field.', '1varchar', '2025-07-23 16:09:27', '2025-07-23 16:12:00', 0, 0);

SET FOREIGN_KEY_CHECKS = 1;
