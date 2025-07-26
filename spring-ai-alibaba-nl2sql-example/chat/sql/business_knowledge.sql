SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for business_knowledge
-- ----------------------------
DROP TABLE IF EXISTS `business_knowledge`;
CREATE TABLE `business_knowledge`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_term` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '业务名词',
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '描述',
  `synonyms` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '同义词',
  `is_recall` int NULL DEFAULT NULL COMMENT '是否召回',
  `data_set_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '数据集id',
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of business_knowledge
-- ----------------------------
INSERT INTO `business_knowledge` VALUES (7, 'Customer Satisfaction', 'Measures how satisfied customers are with the service or product.', 'customer happiness, client contentment', 1, 'dataset_001', '2025-07-23 16:31:43', '2025-07-23 16:31:43');
INSERT INTO `business_knowledge` VALUES (8, 'Net Promoter Score', 'A measure of the likelihood of customers recommending a company to others.', 'NPS, customer loyalty score', 0, 'dataset_002', '2025-07-23 16:31:43', '2025-07-23 16:31:43');
INSERT INTO `business_knowledge` VALUES (9, 'Customer Satisfaction', 'Measures how satisfied customers are with the service or product.', 'customer happiness, client contentment', 1, 'dataset_001', '2025-07-23 16:31:43', '2025-07-23 16:33:18');

SET FOREIGN_KEY_CHECKS = 1;
