# Production Deployment Checklist

## Environment & Secrets

- [ ] `JWT_SECRET` set to a strong random value (`openssl rand -hex 32`)
- [ ] `DATABASE_URL` points to production PostgreSQL instance
- [ ] S3 credentials configured (`S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_REGION`)
- [ ] `USE_LOCAL_STORAGE` set to `false` in production
- [ ] `CORS_ORIGINS` restricted to your production frontend domain(s)
- [ ] `VITE_API_URL` set to production backend URL
- [ ] No `.env` files committed to the repository
- [ ] Default seed passwords changed for all companies

## Security

- [ ] HTTPS enabled (Railway provides this automatically)
- [ ] CORS not set to `*` in production
- [ ] JWT tokens have appropriate expiry time
- [ ] No secrets or credentials in frontend code
- [ ] No private keys or certificates in the repository
- [ ] File upload size limits appropriate (20MB images, 500MB videos)
- [ ] All API endpoints require authentication (except login and health)

## Database

- [ ] PostgreSQL connection uses SSL in production
- [ ] Database backups configured
- [ ] Connection pool settings appropriate for load

## Storage

- [ ] S3 bucket created with appropriate access policies
- [ ] Bucket is not publicly accessible (presigned URLs used for access)
- [ ] Upload directory not served in production when using S3

## Authentication

- [ ] Default company passwords changed from `engineer123`
- [ ] Password change functionality tested
- [ ] Token expiry working correctly
- [ ] Unauthorized access returns 401 properly

## Build & Deploy

- [ ] `npm run build` completes without errors
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Python dependencies are pinned versions
- [ ] Docker image builds successfully
- [ ] Health endpoint (`/api/health`) responds correctly
- [ ] Frontend can reach backend API

## Testing

- [ ] Login/logout flow works
- [ ] Installation creation with photos and videos works
- [ ] Installation editing works
- [ ] File uploads save to S3 correctly
- [ ] Media viewing with presigned URLs works
- [ ] Password change works
- [ ] Unauthorized access is blocked

## Monitoring

- [ ] Application logs do not expose secrets or stack traces
- [ ] Health endpoint available for uptime monitoring
- [ ] Error tracking configured (optional: Sentry, etc.)

## Rollback Plan

- [ ] Previous deployment version noted
- [ ] Database migration is backwards-compatible
- [ ] Rollback procedure documented
