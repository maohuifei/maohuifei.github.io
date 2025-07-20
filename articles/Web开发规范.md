
# REST风格设计规范

---

## 核心原则（Roy Fielding定义）
### 1. CS架构（Client/Server）
- **关注点分离**：客户端与服务器职责解耦
- **服务端职责**：专注数据存储、业务逻辑和安全性
  ✅ 优势：简化服务端逻辑，提升稳定性
- **客户端职责**：专注用户交互与数据展示
  ✅ 优势：支持多终端（Web/App/桌面）兼容，提升可移植性

### 2. 无状态（Stateless）
- 每个请求必须包含**所有必要上下文信息**（如身份令牌、参数）
- 服务端**不存储客户端会话状态**
  ✅ 优势：提升可扩展性，降低服务器资源消耗

### 3. 缓存（Cacheable）
- 通过`Cache-Control`、`ETag`、`Last-Modified`等HTTP头控制缓存
  ✅ 优势：减少重复请求，提升性能
  ⚠️ 注意：敏感数据需标记为`no-store`

### 4. 统一接口（Uniform Interface）
- **资源标识**：URI唯一标识资源（如`/users/123`）
- **表述操作**：通过JSON/XML等格式操作资源
- **自描述消息**：使用标准HTTP方法（GET/POST/PUT/DELETE）
- **HATEOAS**：响应中返回下一步操作的超链接（如分页导航）

### 5. 分层系统（Layered System）
- 客户端无需感知是否直连服务器（可能经过CDN/代理/防火墙）
  ✅ 优势：提升安全性和可扩展性

---

## 命名与结构规范
### 命名规则
- **URI使用名词复数**：`/users`而非`/user`
- **关联资源嵌套**：`/users/{uid}/orders/{oid}`
- **连字符命名**：`/api/v1/user-roles`（非下划线或驼峰）
- **版本控制**：URL路径（`/v1/users`）或请求头（`Accept: application/vnd.myapi.v1+json`）

### 目录结构示例
```markdown
/src
  /controllers    # 请求处理逻辑
  /models         # 数据模型定义
  /routes         # API路由配置
  /middlewares    # 鉴权/日志等中间件
  /utils          # 通用工具类
```

---

## 请求设计规范
### URI设计
- **资源定位**：`GET /users/123`
- **过滤/排序**：`GET /users?role=admin&sort=-created_at`
- **搜索**：`GET /users?q=John+email:gmail.com`

### HTTP方法规范
| 方法    | 幂等性 | 用途                      | 示例               |
|---------|--------|---------------------------|--------------------|
| GET     | ✔️     | 获取资源                  | `GET /users`       |
| POST    | ❌     | 创建资源                  | `POST /users`      |
| PUT     | ✔️     | 全量更新资源              | `PUT /users/123`   |
| PATCH   | ❌     | 部分更新资源              | `PATCH /users/123` |
| DELETE  | ✔️     | 删除资源                  | `DELETE /users/123`|

---

## 响应设计规范
### 数据格式
- **统一响应体**：
  ```json
  {
    "code": 200,
    "data": { /* 主数据 */ },
    "pagination": { /* 分页信息 */ },
    "links": { /* HATEOAS超链接 */ }
  }
  ```

### 分页设计
- **请求参数**：`GET /users?page=2&per_page=20`
- **响应元数据**：
  ```json
  "pagination": {
    "total": 100,
    "current_page": 2,
    "per_page": 20,
    "total_pages": 5
  }
  ```

### 状态码规范
| 状态码 | 场景                     |
|--------|--------------------------|
| 200    | 常规成功                 |
| 201    | 资源创建成功             |
| 204    | 无内容（如DELETE成功）   |
| 400    | 客户端请求错误           |
| 401    | 未授权                   |
| 403    | 禁止访问                 |
| 404    | 资源不存在               |
| 429    | 请求过于频繁（限流触发） |
| 500    | 服务端内部错误           |

### 错误处理示例
```json
{
  "code": 40001,
  "message": "Invalid email format",
  "details": "Email must contain @ symbol"
}
```

---

## 安全规范
### 1. HTTPS强制
- 所有API必须通过**HTTPS**传输
- HTTP请求返回`301 Moved Permanently`

### 2. 鉴权方案
- **OAuth 2.0**：`Authorization: Bearer <token>`
- **API Key**：`X-API-Key: your_key`
- **JWT**：`Authorization: Bearer <JWT>`

### 3. 限流策略
- **速率限制**：`X-RateLimit-Limit: 100`（总配额）
- **剩余配额**：`X-RateLimit-Remaining: 95`
- **重置时间**：`X-RateLimit-Reset: 1661345678`

---

## 最佳实践
1. **版本控制**：通过URL或Header维护API版本
2. **内容协商**：支持`Accept`头指定返回格式（JSON/XML）
3. **文档化**：使用OpenAPI/Swagger生成交互式文档
4. **兼容性**：通过添加新字段而非修改旧字段保持向后兼容
