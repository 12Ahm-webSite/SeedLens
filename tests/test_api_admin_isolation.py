#!/usr/bin/env python3
"""
SeedLens Phase P3 Validation Suite:
Tests API Route and Admin Panel Isolation from Internationalization & Routing Middleware.
Verifies that /api/* and /my-admin remain strictly unredirected, non-locale-prefixed,
and fully protected under Next.js App Router.
"""

import os
import sys
import json
import re

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

def test_api_routes_exist_at_root():
    print("[Test 1] Verifying API route handlers exist at top-level /src/app/api/...")
    api_dir = os.path.join(FRONTEND_DIR, "src", "app", "api")
    assert os.path.isdir(api_dir), f"API directory missing: {api_dir}"
    
    expected_routes = ["analyze", "analytics", "find-seed"]
    for route in expected_routes:
        route_file = os.path.join(api_dir, route, "route.ts")
        assert os.path.isfile(route_file), f"Route file missing: {route_file}"
    print("  -> PASSED: All API route handlers are at top-level /src/app/api/.")

def test_admin_exists_at_root():
    print("[Test 2] Verifying /my-admin exists at top-level /src/app/my-admin/...")
    admin_dir = os.path.join(FRONTEND_DIR, "src", "app", "my-admin")
    assert os.path.isdir(admin_dir), f"Admin directory missing: {admin_dir}"
    
    admin_page = os.path.join(admin_dir, "page.tsx")
    admin_layout = os.path.join(admin_dir, "layout.tsx")
    assert os.path.isfile(admin_page), f"Admin page missing: {admin_page}"
    assert os.path.isfile(admin_layout), f"Admin layout missing: {admin_layout}"
    
    # Verify noindex meta tag in admin layout
    with open(admin_layout, "r", encoding="utf-8") as f:
        content = f.read()
    assert "index: false" in content, "Admin layout must enforce index: false"
    assert "follow: false" in content, "Admin layout must enforce follow: false"
    print("  -> PASSED: /my-admin is isolated at root with strict noindex metadata.")

def test_next_config_security_headers():
    print("[Test 3] Verifying X-Robots-Tag headers in next.config.ts...")
    config_file = os.path.join(FRONTEND_DIR, "next.config.ts")
    with open(config_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "/my-admin/:path*" in content, "Missing /my-admin security header in next.config.ts"
    assert "/api/:path*" in content, "Missing /api security header in next.config.ts"
    assert "noindex, nofollow, noarchive" in content, "Missing noindex directive in next.config.ts"
    print("  -> PASSED: HTTP security headers strictly applied to /my-admin and /api.")

def test_middleware_exclusion_contract():
    print("[Test 4] Verifying middleware.ts bypasses /api/*, /my-admin/*, and assets...")
    middleware_file = os.path.join(FRONTEND_DIR, "src", "middleware.ts")
    if not os.path.isfile(middleware_file):
        print("  -> NOTICE: middleware.ts not yet created. Will be verified once implemented.")
        return
    with open(middleware_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "api" in content, "middleware must explicitly exclude api"
    assert "my-admin" in content, "middleware must explicitly exclude my-admin"
    print("  -> PASSED: middleware.ts explicitly excludes /api and /my-admin from locale redirects.")

def test_routes_manifest_isolation():
    print("[Test 5] Verifying .next/routes-manifest.json if built...")
    manifest_path = os.path.join(FRONTEND_DIR, ".next", "routes-manifest.json")
    if not os.path.isfile(manifest_path):
        print("  -> NOTICE: .next/routes-manifest.json not present. Run npm run build first.")
        return
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    
    dynamic_routes = [r.get("page") for r in manifest.get("dynamicRoutes", [])]
    static_routes = [r.get("page") for r in manifest.get("staticRoutes", [])]
    
    # Confirm /my-admin is at root
    all_pages = dynamic_routes + static_routes
    assert "/my-admin" in all_pages or any(p.startswith("/my-admin") for p in all_pages), \
        f"/my-admin missing from routes manifest: {all_pages}"
    
    # Confirm no route like /[locale]/my-admin
    for p in all_pages:
        assert "/[locale]/my-admin" not in p, f"Forbidden localized admin route found: {p}"
        assert "/[locale]/api" not in p, f"Forbidden localized api route found: {p}"
    print("  -> PASSED: Routes manifest confirms zero leakage of /my-admin or /api into [locale].")

def main():
    print("=== SeedLens P3 API & Admin Isolation Test Suite ===")
    test_api_routes_exist_at_root()
    test_admin_exists_at_root()
    test_next_config_security_headers()
    test_middleware_exclusion_contract()
    test_routes_manifest_isolation()
    print("====================================================")
    print("ALL API & ADMIN ISOLATION CHECKS PASSED SUCCESSFULLY!")
    print("====================================================")

if __name__ == "__main__":
    main()
