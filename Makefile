.PHONY: init infra-up infra-down infra-status infra-logs mongo-shell redis-shell setup-hosts gen-key

# ==============================================================================
# 第一次啟動專案請執行： make init
# ==============================================================================
init: gen-key setup-hosts
	docker-compose pull
	@echo "----------------------------------------------------------------"
	@echo "初始化完成！現在可以使用 'make infra-up' 啟動環境。"
	@echo "----------------------------------------------------------------"

# 生成 MongoDB 副本集所需的 Key 檔案 (權限 600)
gen-key:
	@if [ ! -f mongodb.key ]; then \
		openssl rand -base64 756 > mongodb.key; \
		chmod 600 mongodb.key; \
		echo "Success: mongodb.key generated."; \
	else \
		echo "Info: mongodb.key already exists."; \
	fi

# 自動設定本地 hosts (需要 sudo 權限)
setup-hosts:
	@if grep -q "mongo01" /etc/hosts; then \
		echo "Info: Hosts already configured."; \
	else \
		echo "Adding mongo01, mongo02, mongo03 to /etc/hosts..."; \
		echo "127.0.0.1 mongo01 mongo02 mongo03" | sudo tee -a /etc/hosts; \
	fi

# ==============================================================================
# 日常開發指令
# ==============================================================================

# 啟動所有基礎設施
infra-up:
	docker-compose up -d

# 停止並移除所有基礎設施容器
infra-down:
	docker-compose down

# 查看基礎設施運行狀態
infra-status:
	docker-compose ps

# 查看基礎設施日誌
infra-logs:
	docker-compose logs -f

# 進入 MongoDB Shell
mongo-shell:
	docker exec -it mongo01 mongosh -u root -p 123456

# 進入 Redis Shell
redis-shell:
	docker exec -it chica-redis redis-cli -a "test"

# 自動設定本地 hosts (需要 sudo 權限)
# 這能讓你直接使用專案預設的 mongo01, mongo02, mongo03 域名連線
setup-hosts:
	@if grep -q "mongo01" /etc/hosts; then \
		echo "Hosts already configured."; \
	else \
		echo "Adding mongo01, mongo02, mongo03 to /etc/hosts..."; \
		echo "127.0.0.1 mongo01 mongo02 mongo03" | sudo tee -a /etc/hosts; \
	fi

# 定義所有需要清理的目錄
CLEAN_DIRS = apps/api/dist \
             apps/worker/dist \
             packages/redis/dist \
             packages/api-client/dist \
             packages/lib/dist \
             packages/db/dist

.PHONY: clean

# 清理指令
clean:
	@echo "Cleaning up dist directories..."
	rm -rf $(CLEAN_DIRS)
	@echo "Done."
