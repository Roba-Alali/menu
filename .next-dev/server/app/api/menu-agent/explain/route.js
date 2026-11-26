/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/menu-agent/explain/route";
exports.ids = ["app/api/menu-agent/explain/route"];
exports.modules = {

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-agent%2Fexplain%2Froute&page=%2Fapi%2Fmenu-agent%2Fexplain%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-agent%2Fexplain%2Froute.ts&appDir=%2Fapp%2Fapplet%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Fapplet&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-agent%2Fexplain%2Froute&page=%2Fapi%2Fmenu-agent%2Fexplain%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-agent%2Fexplain%2Froute.ts&appDir=%2Fapp%2Fapplet%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Fapplet&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handler: () => (/* binding */ handler),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/request-meta */ \"(rsc)/./node_modules/next/dist/server/request-meta.js\");\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dist/server/lib/trace/tracer */ \"(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js\");\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/shared/lib/router/utils/app-paths */ \"next/dist/shared/lib/router/utils/app-paths\");\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/base-http/node */ \"(rsc)/./node_modules/next/dist/server/base-http/node.js\");\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dist/server/web/spec-extension/adapters/next-request */ \"(rsc)/./node_modules/next/dist/server/web/spec-extension/adapters/next-request.js\");\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/dist/server/lib/trace/constants */ \"(rsc)/./node_modules/next/dist/server/lib/trace/constants.js\");\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/dist/server/instrumentation/utils */ \"(rsc)/./node_modules/next/dist/server/instrumentation/utils.js\");\n/* harmony import */ var next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/dist/server/send-response */ \"(rsc)/./node_modules/next/dist/server/send-response.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(rsc)/./node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/dist/server/lib/cache-control */ \"(rsc)/./node_modules/next/dist/server/lib/cache-control.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! next/dist/lib/constants */ \"(rsc)/./node_modules/next/dist/lib/constants.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! next/dist/shared/lib/no-fallback-error.external */ \"next/dist/shared/lib/no-fallback-error.external\");\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var next_dist_server_lib_route_cache_key__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! next/dist/server/lib/route-cache-key */ \"(rsc)/./node_modules/next/dist/server/lib/route-cache-key.js\");\n/* harmony import */ var next_dist_server_lib_route_cache_key__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_route_cache_key__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! next/dist/server/response-cache */ \"(rsc)/./node_modules/next/dist/server/response-cache/index.js\");\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_16__);\n/* harmony import */ var _app_applet_src_app_api_menu_agent_explain_route_ts__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./src/app/api/menu-agent/explain/route.ts */ \"(rsc)/./src/app/api/menu-agent/explain/route.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/menu-agent/explain/route\",\n        pathname: \"/api/menu-agent/explain\",\n        filename: \"route\",\n        bundlePath: \"app/api/menu-agent/explain/route\"\n    },\n    distDir: \".next-dev\" || 0,\n    relativeProjectDir:  false || '',\n    resolvedPagePath: \"/app/applet/src/app/api/menu-agent/explain/route.ts\",\n    nextConfigOutput,\n    userland: _app_applet_src_app_api_menu_agent_explain_route_ts__WEBPACK_IMPORTED_MODULE_17__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\nasync function handler(req, res, ctx) {\n    var _nextConfig_experimental;\n    let srcPage = \"/api/menu-agent/explain/route\";\n    // turbopack doesn't normalize `/index` in the page name\n    // so we need to to process dynamic routes properly\n    // TODO: fix turbopack providing differing value from webpack\n    if (false) {} else if (srcPage === '/index') {\n        // we always normalize /index specifically\n        srcPage = '/';\n    }\n    const multiZoneDraftMode = false;\n    const prepareResult = await routeModule.prepare(req, res, {\n        srcPage,\n        multiZoneDraftMode\n    });\n    if (!prepareResult) {\n        res.statusCode = 400;\n        res.end('Bad Request');\n        ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, Promise.resolve());\n        return null;\n    }\n    const { buildId, params, nextConfig, isDraftMode, prerenderManifest, routerServerContext, isOnDemandRevalidate, revalidateOnlyGenerated, resolvedPathname } = prepareResult;\n    const normalizedSrcPage = (0,next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__.normalizeAppPath)(srcPage);\n    // Only this route's prerenders can establish ISR or admit generated params.\n    const isPrerendered = Boolean(prerenderManifest.routes[resolvedPathname]) && (routeModule.isDev || (0,next_dist_server_lib_route_cache_key__WEBPACK_IMPORTED_MODULE_15__.isRouteCacheOwner)(resolvedPathname, routeModule.cacheOwner, prerenderManifest.routes[resolvedPathname]));\n    let isIsr = Boolean(prerenderManifest.dynamicRoutes[normalizedSrcPage] || isPrerendered);\n    if (isIsr && !isDraftMode) {\n        const prerenderInfo = prerenderManifest.dynamicRoutes[normalizedSrcPage];\n        if (prerenderInfo) {\n            if (prerenderInfo.fallback === false && !isPrerendered) {\n                throw new next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError();\n            }\n        }\n    }\n    let cacheKey = null;\n    if (isIsr && !routeModule.isDev && !isDraftMode) {\n        cacheKey = resolvedPathname;\n        // ensure /index and / is normalized to one key\n        cacheKey = cacheKey === '/index' ? '/' : cacheKey;\n    }\n    const supportsDynamicResponse = // If we're in development, we always support dynamic HTML\n    routeModule.isDev === true || // If this is not SSG or does not have static paths, then it supports\n    // dynamic HTML.\n    !isIsr;\n    // This is a revalidation request if the request is for a static\n    // page and it is not being resumed from a postponed render and\n    // it is not a dynamic RSC request then it is a revalidation\n    // request.\n    const isRevalidate = isIsr && !supportsDynamicResponse;\n    const method = req.method || 'GET';\n    const tracer = (0,next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.getTracer)();\n    const activeSpan = tracer.getActiveScopeSpan();\n    const context = {\n        params,\n        prerenderManifest,\n        renderOpts: {\n            experimental: {\n                cacheComponents: Boolean(nextConfig.experimental.cacheComponents),\n                authInterrupts: Boolean(nextConfig.experimental.authInterrupts)\n            },\n            supportsDynamicResponse,\n            incrementalCache: (0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'incrementalCache'),\n            cacheLifeProfiles: (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.cacheLife,\n            isRevalidate,\n            waitUntil: ctx.waitUntil,\n            onClose: (cb)=>{\n                res.on('close', cb);\n            },\n            onAfterTaskError: undefined,\n            onInstrumentationRequestError: (error, _request, errorContext)=>routeModule.onRequestError(req, error, errorContext, routerServerContext)\n        },\n        sharedContext: {\n            buildId\n        }\n    };\n    const nodeNextReq = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextRequest(req);\n    const nodeNextRes = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextResponse(res);\n    const nextReq = next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.NextRequestAdapter.fromNodeNextRequest(nodeNextReq, (0,next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.signalFromNodeResponse)(res));\n    try {\n        const invokeRouteModule = async (span)=>{\n            return routeModule.handle(nextReq, context).finally(()=>{\n                if (!span) return;\n                span.setAttributes({\n                    'http.status_code': res.statusCode,\n                    'next.rsc': false\n                });\n                const rootSpanAttributes = tracer.getRootSpanAttributes();\n                // We were unable to get attributes, probably OTEL is not enabled\n                if (!rootSpanAttributes) {\n                    return;\n                }\n                if (rootSpanAttributes.get('next.span_type') !== next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest) {\n                    console.warn(`Unexpected root span type '${rootSpanAttributes.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`);\n                    return;\n                }\n                const route = rootSpanAttributes.get('next.route');\n                if (route) {\n                    const name = `${method} ${route}`;\n                    span.setAttributes({\n                        'next.route': route,\n                        'http.route': route,\n                        'next.span_name': name\n                    });\n                    span.updateName(name);\n                } else {\n                    span.updateName(`${method} ${req.url}`);\n                }\n            });\n        };\n        const handleResponse = async (currentSpan)=>{\n            var _cacheEntry_value;\n            const responseGenerator = async ({ previousCacheEntry })=>{\n                try {\n                    if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isOnDemandRevalidate && revalidateOnlyGenerated && !previousCacheEntry) {\n                        res.statusCode = 404;\n                        // on-demand revalidate always sets this header\n                        res.setHeader('x-nextjs-cache', 'REVALIDATED');\n                        res.end('This page could not be found');\n                        return null;\n                    }\n                    const response = await invokeRouteModule(currentSpan);\n                    req.fetchMetrics = context.renderOpts.fetchMetrics;\n                    let pendingWaitUntil = context.renderOpts.pendingWaitUntil;\n                    // Attempt using provided waitUntil if available\n                    // if it's not we fallback to sendResponse's handling\n                    if (pendingWaitUntil) {\n                        if (ctx.waitUntil) {\n                            ctx.waitUntil(pendingWaitUntil);\n                            pendingWaitUntil = undefined;\n                        }\n                    }\n                    const cacheTags = context.renderOpts.collectedTags;\n                    // If the request is for a static response, we can cache it so long\n                    // as it's not edge.\n                    if (isIsr) {\n                        const blob = await response.blob();\n                        // Copy the headers from the response.\n                        const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.toNodeOutgoingHttpHeaders)(response.headers);\n                        if (cacheTags) {\n                            headers[next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER] = cacheTags;\n                        }\n                        if (!headers['content-type'] && blob.type) {\n                            headers['content-type'] = blob.type;\n                        }\n                        const revalidate = typeof context.renderOpts.collectedRevalidate === 'undefined' || context.renderOpts.collectedRevalidate >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? false : context.renderOpts.collectedRevalidate;\n                        const expire = typeof context.renderOpts.collectedExpire === 'undefined' || context.renderOpts.collectedExpire >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? undefined : context.renderOpts.collectedExpire;\n                        // Create the cache entry for the response.\n                        const cacheEntry = {\n                            value: {\n                                kind: next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_16__.CachedRouteKind.APP_ROUTE,\n                                status: response.status,\n                                body: Buffer.from(await blob.arrayBuffer()),\n                                headers\n                            },\n                            cacheControl: {\n                                revalidate,\n                                expire\n                            }\n                        };\n                        return cacheEntry;\n                    } else {\n                        // send response without caching if not ISR\n                        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, response, context.renderOpts.pendingWaitUntil);\n                        return null;\n                    }\n                } catch (err) {\n                    // if this is a background revalidate we need to report\n                    // the request error here as it won't be bubbled\n                    if (previousCacheEntry == null ? void 0 : previousCacheEntry.isStale) {\n                        await routeModule.onRequestError(req, err, {\n                            routerKind: 'App Router',\n                            routePath: srcPage,\n                            routeType: 'route',\n                            revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                                isRevalidate,\n                                isOnDemandRevalidate\n                            })\n                        }, routerServerContext);\n                    }\n                    throw err;\n                }\n            };\n            const cacheEntry = await routeModule.handleResponse({\n                req,\n                nextConfig,\n                cacheKey,\n                routeKind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n                isFallback: false,\n                prerenderManifest,\n                isRoutePPREnabled: false,\n                isOnDemandRevalidate,\n                revalidateOnlyGenerated,\n                responseGenerator,\n                waitUntil: ctx.waitUntil\n            });\n            // we don't create a cacheEntry for ISR\n            if (!isIsr) {\n                return null;\n            }\n            if ((cacheEntry == null ? void 0 : (_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) !== next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_16__.CachedRouteKind.APP_ROUTE) {\n                var _cacheEntry_value1;\n                throw Object.defineProperty(new Error(`Invariant: app-route received invalid cache entry ${cacheEntry == null ? void 0 : (_cacheEntry_value1 = cacheEntry.value) == null ? void 0 : _cacheEntry_value1.kind}`), \"__NEXT_ERROR_CODE\", {\n                    value: \"E701\",\n                    enumerable: false,\n                    configurable: true\n                });\n            }\n            if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode')) {\n                res.setHeader('x-nextjs-cache', isOnDemandRevalidate ? 'REVALIDATED' : cacheEntry.isMiss ? 'MISS' : cacheEntry.isStale ? 'STALE' : 'HIT');\n            }\n            // Draft mode should never be cached\n            if (isDraftMode) {\n                res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');\n            }\n            const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.fromNodeOutgoingHttpHeaders)(cacheEntry.value.headers);\n            if (!((0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isIsr)) {\n                headers.delete(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER);\n            }\n            // If cache control is already set on the response we don't\n            // override it to allow users to customize it via next.config\n            if (cacheEntry.cacheControl && !res.getHeader('Cache-Control') && !headers.get('Cache-Control')) {\n                headers.set('Cache-Control', (0,next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__.getCacheControlHeader)(cacheEntry.cacheControl));\n            }\n            await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(cacheEntry.value.body, {\n                headers,\n                status: cacheEntry.value.status || 200\n            }));\n            return null;\n        };\n        // TODO: activeSpan code path is for when wrapped by\n        // next-server can be removed when this is no longer used\n        if (activeSpan) {\n            await handleResponse(activeSpan);\n        } else {\n            await tracer.withPropagatedContext(req.headers, ()=>tracer.trace(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest, {\n                    spanName: `${method} ${req.url}`,\n                    kind: next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.SpanKind.SERVER,\n                    attributes: {\n                        'http.method': method,\n                        'http.target': req.url\n                    }\n                }, handleResponse));\n        }\n    } catch (err) {\n        if (!(err instanceof next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError)) {\n            await routeModule.onRequestError(req, err, {\n                routerKind: 'App Router',\n                routePath: normalizedSrcPage,\n                routeType: 'route',\n                revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                    isRevalidate,\n                    isOnDemandRevalidate\n                })\n            });\n        }\n        // rethrow so that we can handle serving error page\n        // If this is during static generation, throw the error again.\n        if (isIsr) throw err;\n        // Otherwise, send a 500 response.\n        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(null, {\n            status: 500\n        }));\n        return null;\n    }\n}\n\n//# sourceMappingURL=app-route.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtZW51LWFnZW50JTJGZXhwbGFpbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbWVudS1hZ2VudCUyRmV4cGxhaW4lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZtZW51LWFnZW50JTJGZXhwbGFpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZhcHAlMkZhcHBsZXQlMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRmFwcCUyRmFwcGxldCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1zdGFuZGFsb25lJnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QmaXNHbG9iYWxOb3RGb3VuZEVuYWJsZWQ9ISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2Q7QUFDUztBQUNPO0FBQ0s7QUFDbUM7QUFDakQ7QUFDTztBQUNmO0FBQ3NDO0FBQ3pCO0FBQ007QUFDQztBQUNUO0FBQ1A7QUFDYztBQUNoRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxhQUFhLFdBQW9DLElBQUksQ0FBRTtBQUN2RCx3QkFBd0IsTUFBdUM7QUFDL0Q7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7QUFDbkY7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFxQixFQUFFLEVBRTFCLENBQUM7QUFDTjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsS0FBd0M7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0pBQW9KO0FBQ2hLLDhCQUE4Qiw2RkFBZ0I7QUFDOUM7QUFDQSx1R0FBdUcsd0ZBQWlCO0FBQ3hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNkZBQWU7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNEVBQVM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLDhCQUE4Qiw2RUFBYztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsNEVBQWU7QUFDM0MsNEJBQTRCLDZFQUFnQjtBQUM1QyxvQkFBb0IseUdBQWtCLGtDQUFrQyxpSEFBc0I7QUFDOUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxnRkFBYztBQUMvRSwrREFBK0QseUNBQXlDO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFFBQVEsRUFBRSxNQUFNO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0Esa0JBQWtCO0FBQ2xCLHVDQUF1QyxRQUFRLEVBQUUsUUFBUTtBQUN6RDtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0Msb0JBQW9CO0FBQ25FO0FBQ0EseUJBQXlCLDZFQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msc0ZBQXlCO0FBQ2pFO0FBQ0Esb0NBQW9DLDRFQUFzQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNKQUFzSixvRUFBYztBQUNwSywwSUFBMEksb0VBQWM7QUFDeEo7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLDZFQUFlO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSw4QkFBOEIsNkVBQVk7QUFDMUM7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QywyRkFBbUI7QUFDakU7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrRUFBUztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFJQUFxSSw2RUFBZTtBQUNwSjtBQUNBLDJHQUEyRyxpSEFBaUg7QUFDNU47QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsaUJBQWlCLDZFQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3RkFBMkI7QUFDdkQsa0JBQWtCLDZFQUFjO0FBQ2hDLCtCQUErQiw0RUFBc0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsMEZBQXFCO0FBQ2xFO0FBQ0Esa0JBQWtCLDZFQUFZO0FBQzlCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLDZFQUE2RSxnRkFBYztBQUMzRixpQ0FBaUMsUUFBUSxFQUFFLFFBQVE7QUFDbkQsMEJBQTBCLHVFQUFRO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsTUFBTTtBQUNOLDZCQUE2Qiw2RkFBZTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyRkFBbUI7QUFDckQ7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsNkVBQVk7QUFDMUI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0IHsgZ2V0UmVxdWVzdE1ldGEgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yZXF1ZXN0LW1ldGFcIjtcbmltcG9ydCB7IGdldFRyYWNlciwgU3BhbktpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvdHJhY2UvdHJhY2VyXCI7XG5pbXBvcnQgeyBub3JtYWxpemVBcHBQYXRoIH0gZnJvbSBcIm5leHQvZGlzdC9zaGFyZWQvbGliL3JvdXRlci91dGlscy9hcHAtcGF0aHNcIjtcbmltcG9ydCB7IE5vZGVOZXh0UmVxdWVzdCwgTm9kZU5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Jhc2UtaHR0cC9ub2RlXCI7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdEFkYXB0ZXIsIHNpZ25hbEZyb21Ob2RlUmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvc3BlYy1leHRlbnNpb24vYWRhcHRlcnMvbmV4dC1yZXF1ZXN0XCI7XG5pbXBvcnQgeyBCYXNlU2VydmVyU3BhbiB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi90cmFjZS9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldFJldmFsaWRhdGVSZWFzb24gfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9pbnN0cnVtZW50YXRpb24vdXRpbHNcIjtcbmltcG9ydCB7IHNlbmRSZXNwb25zZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3NlbmQtcmVzcG9uc2VcIjtcbmltcG9ydCB7IGZyb21Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycywgdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3dlYi91dGlsc1wiO1xuaW1wb3J0IHsgZ2V0Q2FjaGVDb250cm9sSGVhZGVyIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL2NhY2hlLWNvbnRyb2xcIjtcbmltcG9ydCB7IElORklOSVRFX0NBQ0hFLCBORVhUX0NBQ0hFX1RBR1NfSEVBREVSIH0gZnJvbSBcIm5leHQvZGlzdC9saWIvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBOb0ZhbGxiYWNrRXJyb3IgfSBmcm9tIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvbm8tZmFsbGJhY2stZXJyb3IuZXh0ZXJuYWxcIjtcbmltcG9ydCB7IGlzUm91dGVDYWNoZU93bmVyIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3JvdXRlLWNhY2hlLWtleVwiO1xuaW1wb3J0IHsgQ2FjaGVkUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcmVzcG9uc2UtY2FjaGVcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvYXBwL2FwcGxldC9zcmMvYXBwL2FwaS9tZW51LWFnZW50L2V4cGxhaW4vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwic3RhbmRhbG9uZVwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tZW51LWFnZW50L2V4cGxhaW4vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9tZW51LWFnZW50L2V4cGxhaW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL21lbnUtYWdlbnQvZXhwbGFpbi9yb3V0ZVwiXG4gICAgfSxcbiAgICBkaXN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfRElTVF9ESVIgfHwgJycsXG4gICAgcmVsYXRpdmVQcm9qZWN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfUFJPSkVDVF9ESVIgfHwgJycsXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvYXBwL2FwcGxldC9zcmMvYXBwL2FwaS9tZW51LWFnZW50L2V4cGxhaW4vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcywgY3R4KSB7XG4gICAgdmFyIF9uZXh0Q29uZmlnX2V4cGVyaW1lbnRhbDtcbiAgICBsZXQgc3JjUGFnZSA9IFwiL2FwaS9tZW51LWFnZW50L2V4cGxhaW4vcm91dGVcIjtcbiAgICAvLyB0dXJib3BhY2sgZG9lc24ndCBub3JtYWxpemUgYC9pbmRleGAgaW4gdGhlIHBhZ2UgbmFtZVxuICAgIC8vIHNvIHdlIG5lZWQgdG8gdG8gcHJvY2VzcyBkeW5hbWljIHJvdXRlcyBwcm9wZXJseVxuICAgIC8vIFRPRE86IGZpeCB0dXJib3BhY2sgcHJvdmlkaW5nIGRpZmZlcmluZyB2YWx1ZSBmcm9tIHdlYnBhY2tcbiAgICBpZiAocHJvY2Vzcy5lbnYuVFVSQk9QQUNLKSB7XG4gICAgICAgIHNyY1BhZ2UgPSBzcmNQYWdlLnJlcGxhY2UoL1xcL2luZGV4JC8sICcnKSB8fCAnLyc7XG4gICAgfSBlbHNlIGlmIChzcmNQYWdlID09PSAnL2luZGV4Jykge1xuICAgICAgICAvLyB3ZSBhbHdheXMgbm9ybWFsaXplIC9pbmRleCBzcGVjaWZpY2FsbHlcbiAgICAgICAgc3JjUGFnZSA9ICcvJztcbiAgICB9XG4gICAgY29uc3QgbXVsdGlab25lRHJhZnRNb2RlID0gcHJvY2Vzcy5lbnYuX19ORVhUX01VTFRJX1pPTkVfRFJBRlRfTU9ERTtcbiAgICBjb25zdCBwcmVwYXJlUmVzdWx0ID0gYXdhaXQgcm91dGVNb2R1bGUucHJlcGFyZShyZXEsIHJlcywge1xuICAgICAgICBzcmNQYWdlLFxuICAgICAgICBtdWx0aVpvbmVEcmFmdE1vZGVcbiAgICB9KTtcbiAgICBpZiAoIXByZXBhcmVSZXN1bHQpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoJ0JhZCBSZXF1ZXN0Jyk7XG4gICAgICAgIGN0eC53YWl0VW50aWwgPT0gbnVsbCA/IHZvaWQgMCA6IGN0eC53YWl0VW50aWwuY2FsbChjdHgsIFByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgYnVpbGRJZCwgcGFyYW1zLCBuZXh0Q29uZmlnLCBpc0RyYWZ0TW9kZSwgcHJlcmVuZGVyTWFuaWZlc3QsIHJvdXRlclNlcnZlckNvbnRleHQsIGlzT25EZW1hbmRSZXZhbGlkYXRlLCByZXZhbGlkYXRlT25seUdlbmVyYXRlZCwgcmVzb2x2ZWRQYXRobmFtZSB9ID0gcHJlcGFyZVJlc3VsdDtcbiAgICBjb25zdCBub3JtYWxpemVkU3JjUGFnZSA9IG5vcm1hbGl6ZUFwcFBhdGgoc3JjUGFnZSk7XG4gICAgLy8gT25seSB0aGlzIHJvdXRlJ3MgcHJlcmVuZGVycyBjYW4gZXN0YWJsaXNoIElTUiBvciBhZG1pdCBnZW5lcmF0ZWQgcGFyYW1zLlxuICAgIGNvbnN0IGlzUHJlcmVuZGVyZWQgPSBCb29sZWFuKHByZXJlbmRlck1hbmlmZXN0LnJvdXRlc1tyZXNvbHZlZFBhdGhuYW1lXSkgJiYgKHJvdXRlTW9kdWxlLmlzRGV2IHx8IGlzUm91dGVDYWNoZU93bmVyKHJlc29sdmVkUGF0aG5hbWUsIHJvdXRlTW9kdWxlLmNhY2hlT3duZXIsIHByZXJlbmRlck1hbmlmZXN0LnJvdXRlc1tyZXNvbHZlZFBhdGhuYW1lXSkpO1xuICAgIGxldCBpc0lzciA9IEJvb2xlYW4ocHJlcmVuZGVyTWFuaWZlc3QuZHluYW1pY1JvdXRlc1tub3JtYWxpemVkU3JjUGFnZV0gfHwgaXNQcmVyZW5kZXJlZCk7XG4gICAgaWYgKGlzSXNyICYmICFpc0RyYWZ0TW9kZSkge1xuICAgICAgICBjb25zdCBwcmVyZW5kZXJJbmZvID0gcHJlcmVuZGVyTWFuaWZlc3QuZHluYW1pY1JvdXRlc1tub3JtYWxpemVkU3JjUGFnZV07XG4gICAgICAgIGlmIChwcmVyZW5kZXJJbmZvKSB7XG4gICAgICAgICAgICBpZiAocHJlcmVuZGVySW5mby5mYWxsYmFjayA9PT0gZmFsc2UgJiYgIWlzUHJlcmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm9GYWxsYmFja0Vycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNhY2hlS2V5ID0gbnVsbDtcbiAgICBpZiAoaXNJc3IgJiYgIXJvdXRlTW9kdWxlLmlzRGV2ICYmICFpc0RyYWZ0TW9kZSkge1xuICAgICAgICBjYWNoZUtleSA9IHJlc29sdmVkUGF0aG5hbWU7XG4gICAgICAgIC8vIGVuc3VyZSAvaW5kZXggYW5kIC8gaXMgbm9ybWFsaXplZCB0byBvbmUga2V5XG4gICAgICAgIGNhY2hlS2V5ID0gY2FjaGVLZXkgPT09ICcvaW5kZXgnID8gJy8nIDogY2FjaGVLZXk7XG4gICAgfVxuICAgIGNvbnN0IHN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlID0gLy8gSWYgd2UncmUgaW4gZGV2ZWxvcG1lbnQsIHdlIGFsd2F5cyBzdXBwb3J0IGR5bmFtaWMgSFRNTFxuICAgIHJvdXRlTW9kdWxlLmlzRGV2ID09PSB0cnVlIHx8IC8vIElmIHRoaXMgaXMgbm90IFNTRyBvciBkb2VzIG5vdCBoYXZlIHN0YXRpYyBwYXRocywgdGhlbiBpdCBzdXBwb3J0c1xuICAgIC8vIGR5bmFtaWMgSFRNTC5cbiAgICAhaXNJc3I7XG4gICAgLy8gVGhpcyBpcyBhIHJldmFsaWRhdGlvbiByZXF1ZXN0IGlmIHRoZSByZXF1ZXN0IGlzIGZvciBhIHN0YXRpY1xuICAgIC8vIHBhZ2UgYW5kIGl0IGlzIG5vdCBiZWluZyByZXN1bWVkIGZyb20gYSBwb3N0cG9uZWQgcmVuZGVyIGFuZFxuICAgIC8vIGl0IGlzIG5vdCBhIGR5bmFtaWMgUlNDIHJlcXVlc3QgdGhlbiBpdCBpcyBhIHJldmFsaWRhdGlvblxuICAgIC8vIHJlcXVlc3QuXG4gICAgY29uc3QgaXNSZXZhbGlkYXRlID0gaXNJc3IgJiYgIXN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ0dFVCc7XG4gICAgY29uc3QgdHJhY2VyID0gZ2V0VHJhY2VyKCk7XG4gICAgY29uc3QgYWN0aXZlU3BhbiA9IHRyYWNlci5nZXRBY3RpdmVTY29wZVNwYW4oKTtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHByZXJlbmRlck1hbmlmZXN0LFxuICAgICAgICByZW5kZXJPcHRzOiB7XG4gICAgICAgICAgICBleHBlcmltZW50YWw6IHtcbiAgICAgICAgICAgICAgICBjYWNoZUNvbXBvbmVudHM6IEJvb2xlYW4obmV4dENvbmZpZy5leHBlcmltZW50YWwuY2FjaGVDb21wb25lbnRzKSxcbiAgICAgICAgICAgICAgICBhdXRoSW50ZXJydXB0czogQm9vbGVhbihuZXh0Q29uZmlnLmV4cGVyaW1lbnRhbC5hdXRoSW50ZXJydXB0cylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdXBwb3J0c0R5bmFtaWNSZXNwb25zZSxcbiAgICAgICAgICAgIGluY3JlbWVudGFsQ2FjaGU6IGdldFJlcXVlc3RNZXRhKHJlcSwgJ2luY3JlbWVudGFsQ2FjaGUnKSxcbiAgICAgICAgICAgIGNhY2hlTGlmZVByb2ZpbGVzOiAoX25leHRDb25maWdfZXhwZXJpbWVudGFsID0gbmV4dENvbmZpZy5leHBlcmltZW50YWwpID09IG51bGwgPyB2b2lkIDAgOiBfbmV4dENvbmZpZ19leHBlcmltZW50YWwuY2FjaGVMaWZlLFxuICAgICAgICAgICAgaXNSZXZhbGlkYXRlLFxuICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsLFxuICAgICAgICAgICAgb25DbG9zZTogKGNiKT0+e1xuICAgICAgICAgICAgICAgIHJlcy5vbignY2xvc2UnLCBjYik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25BZnRlclRhc2tFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25JbnN0cnVtZW50YXRpb25SZXF1ZXN0RXJyb3I6IChlcnJvciwgX3JlcXVlc3QsIGVycm9yQ29udGV4dCk9PnJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyb3IsIGVycm9yQ29udGV4dCwgcm91dGVyU2VydmVyQ29udGV4dClcbiAgICAgICAgfSxcbiAgICAgICAgc2hhcmVkQ29udGV4dDoge1xuICAgICAgICAgICAgYnVpbGRJZFxuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBub2RlTmV4dFJlcSA9IG5ldyBOb2RlTmV4dFJlcXVlc3QocmVxKTtcbiAgICBjb25zdCBub2RlTmV4dFJlcyA9IG5ldyBOb2RlTmV4dFJlc3BvbnNlKHJlcyk7XG4gICAgY29uc3QgbmV4dFJlcSA9IE5leHRSZXF1ZXN0QWRhcHRlci5mcm9tTm9kZU5leHRSZXF1ZXN0KG5vZGVOZXh0UmVxLCBzaWduYWxGcm9tTm9kZVJlc3BvbnNlKHJlcykpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGludm9rZVJvdXRlTW9kdWxlID0gYXN5bmMgKHNwYW4pPT57XG4gICAgICAgICAgICByZXR1cm4gcm91dGVNb2R1bGUuaGFuZGxlKG5leHRSZXEsIGNvbnRleHQpLmZpbmFsbHkoKCk9PntcbiAgICAgICAgICAgICAgICBpZiAoIXNwYW4pIHJldHVybjtcbiAgICAgICAgICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgICAgICAnaHR0cC5zdGF0dXNfY29kZSc6IHJlcy5zdGF0dXNDb2RlLFxuICAgICAgICAgICAgICAgICAgICAnbmV4dC5yc2MnOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvb3RTcGFuQXR0cmlidXRlcyA9IHRyYWNlci5nZXRSb290U3BhbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAgICAgICAvLyBXZSB3ZXJlIHVuYWJsZSB0byBnZXQgYXR0cmlidXRlcywgcHJvYmFibHkgT1RFTCBpcyBub3QgZW5hYmxlZFxuICAgICAgICAgICAgICAgIGlmICghcm9vdFNwYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQuc3Bhbl90eXBlJykgIT09IEJhc2VTZXJ2ZXJTcGFuLmhhbmRsZVJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmV4cGVjdGVkIHJvb3Qgc3BhbiB0eXBlICcke3Jvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQuc3Bhbl90eXBlJyl9Jy4gUGxlYXNlIHJlcG9ydCB0aGlzIE5leHQuanMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL3ZlcmNlbC9uZXh0LmpzYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGUgPSByb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnJvdXRlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBgJHttZXRob2R9ICR7cm91dGV9YDtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICduZXh0LnJvdXRlJzogcm91dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC5yb3V0ZSc6IHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25leHQuc3Bhbl9uYW1lJzogbmFtZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi51cGRhdGVOYW1lKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4udXBkYXRlTmFtZShgJHttZXRob2R9ICR7cmVxLnVybH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGFuZGxlUmVzcG9uc2UgPSBhc3luYyAoY3VycmVudFNwYW4pPT57XG4gICAgICAgICAgICB2YXIgX2NhY2hlRW50cnlfdmFsdWU7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZUdlbmVyYXRvciA9IGFzeW5jICh7IHByZXZpb3VzQ2FjaGVFbnRyeSB9KT0+e1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2V0UmVxdWVzdE1ldGEocmVxLCAnbWluaW1hbE1vZGUnKSAmJiBpc09uRGVtYW5kUmV2YWxpZGF0ZSAmJiByZXZhbGlkYXRlT25seUdlbmVyYXRlZCAmJiAhcHJldmlvdXNDYWNoZUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9uLWRlbWFuZCByZXZhbGlkYXRlIGFsd2F5cyBzZXRzIHRoaXMgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCd4LW5leHRqcy1jYWNoZScsICdSRVZBTElEQVRFRCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgnVGhpcyBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VSb3V0ZU1vZHVsZShjdXJyZW50U3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5mZXRjaE1ldHJpY3MgPSBjb250ZXh0LnJlbmRlck9wdHMuZmV0Y2hNZXRyaWNzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGVuZGluZ1dhaXRVbnRpbCA9IGNvbnRleHQucmVuZGVyT3B0cy5wZW5kaW5nV2FpdFVudGlsO1xuICAgICAgICAgICAgICAgICAgICAvLyBBdHRlbXB0IHVzaW5nIHByb3ZpZGVkIHdhaXRVbnRpbCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQncyBub3Qgd2UgZmFsbGJhY2sgdG8gc2VuZFJlc3BvbnNlJ3MgaGFuZGxpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdXYWl0VW50aWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdHgud2FpdFVudGlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LndhaXRVbnRpbChwZW5kaW5nV2FpdFVudGlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZW5kaW5nV2FpdFVudGlsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlVGFncyA9IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRUYWdzO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCBpcyBmb3IgYSBzdGF0aWMgcmVzcG9uc2UsIHdlIGNhbiBjYWNoZSBpdCBzbyBsb25nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGl0J3Mgbm90IGVkZ2UuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0lzcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIGhlYWRlcnMgZnJvbSB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyhyZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzW05FWFRfQ0FDSEVfVEFHU19IRUFERVJdID0gY2FjaGVUYWdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkZXJzWydjb250ZW50LXR5cGUnXSAmJiBibG9iLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzWydjb250ZW50LXR5cGUnXSA9IGJsb2IudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldmFsaWRhdGUgPSB0eXBlb2YgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFJldmFsaWRhdGUgPT09ICd1bmRlZmluZWQnIHx8IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRSZXZhbGlkYXRlID49IElORklOSVRFX0NBQ0hFID8gZmFsc2UgOiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkUmV2YWxpZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGlyZSA9IHR5cGVvZiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlID09PSAndW5kZWZpbmVkJyB8fCBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlID49IElORklOSVRFX0NBQ0hFID8gdW5kZWZpbmVkIDogY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY2FjaGUgZW50cnkgZm9yIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlRW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogQ2FjaGVkUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEJ1ZmZlci5mcm9tKGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlQ29udHJvbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIHJlc3BvbnNlIHdpdGhvdXQgY2FjaGluZyBpZiBub3QgSVNSXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCByZXNwb25zZSwgY29udGV4dC5yZW5kZXJPcHRzLnBlbmRpbmdXYWl0VW50aWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGJhY2tncm91bmQgcmV2YWxpZGF0ZSB3ZSBuZWVkIHRvIHJlcG9ydFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmVxdWVzdCBlcnJvciBoZXJlIGFzIGl0IHdvbid0IGJlIGJ1YmJsZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogcHJldmlvdXNDYWNoZUVudHJ5LmlzU3RhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyS2luZDogJ0FwcCBSb3V0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogc3JjUGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdyb3V0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogZ2V0UmV2YWxpZGF0ZVJlYXNvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcm91dGVyU2VydmVyQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBjYWNoZUVudHJ5ID0gYXdhaXQgcm91dGVNb2R1bGUuaGFuZGxlUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICBuZXh0Q29uZmlnLFxuICAgICAgICAgICAgICAgIGNhY2hlS2V5LFxuICAgICAgICAgICAgICAgIHJvdXRlS2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgICAgICAgICBpc0ZhbGxiYWNrOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcmVyZW5kZXJNYW5pZmVzdCxcbiAgICAgICAgICAgICAgICBpc1JvdXRlUFBSRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZU9ubHlHZW5lcmF0ZWQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VHZW5lcmF0b3IsXG4gICAgICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGNyZWF0ZSBhIGNhY2hlRW50cnkgZm9yIElTUlxuICAgICAgICAgICAgaWYgKCFpc0lzcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChjYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiAoX2NhY2hlRW50cnlfdmFsdWUgPSBjYWNoZUVudHJ5LnZhbHVlKSA9PSBudWxsID8gdm9pZCAwIDogX2NhY2hlRW50cnlfdmFsdWUua2luZCkgIT09IENhY2hlZFJvdXRlS2luZC5BUFBfUk9VVEUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2NhY2hlRW50cnlfdmFsdWUxO1xuICAgICAgICAgICAgICAgIHRocm93IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXcgRXJyb3IoYEludmFyaWFudDogYXBwLXJvdXRlIHJlY2VpdmVkIGludmFsaWQgY2FjaGUgZW50cnkgJHtjYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiAoX2NhY2hlRW50cnlfdmFsdWUxID0gY2FjaGVFbnRyeS52YWx1ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jYWNoZUVudHJ5X3ZhbHVlMS5raW5kfWApLCBcIl9fTkVYVF9FUlJPUl9DT0RFXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiRTcwMVwiLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWdldFJlcXVlc3RNZXRhKHJlcSwgJ21pbmltYWxNb2RlJykpIHtcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCd4LW5leHRqcy1jYWNoZScsIGlzT25EZW1hbmRSZXZhbGlkYXRlID8gJ1JFVkFMSURBVEVEJyA6IGNhY2hlRW50cnkuaXNNaXNzID8gJ01JU1MnIDogY2FjaGVFbnRyeS5pc1N0YWxlID8gJ1NUQUxFJyA6ICdISVQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERyYWZ0IG1vZGUgc2hvdWxkIG5ldmVyIGJlIGNhY2hlZFxuICAgICAgICAgICAgaWYgKGlzRHJhZnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICdwcml2YXRlLCBuby1jYWNoZSwgbm8tc3RvcmUsIG1heC1hZ2U9MCwgbXVzdC1yZXZhbGlkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gZnJvbU5vZGVPdXRnb2luZ0h0dHBIZWFkZXJzKGNhY2hlRW50cnkudmFsdWUuaGVhZGVycyk7XG4gICAgICAgICAgICBpZiAoIShnZXRSZXF1ZXN0TWV0YShyZXEsICdtaW5pbWFsTW9kZScpICYmIGlzSXNyKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuZGVsZXRlKE5FWFRfQ0FDSEVfVEFHU19IRUFERVIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgY2FjaGUgY29udHJvbCBpcyBhbHJlYWR5IHNldCBvbiB0aGUgcmVzcG9uc2Ugd2UgZG9uJ3RcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlIGl0IHRvIGFsbG93IHVzZXJzIHRvIGN1c3RvbWl6ZSBpdCB2aWEgbmV4dC5jb25maWdcbiAgICAgICAgICAgIGlmIChjYWNoZUVudHJ5LmNhY2hlQ29udHJvbCAmJiAhcmVzLmdldEhlYWRlcignQ2FjaGUtQ29udHJvbCcpICYmICFoZWFkZXJzLmdldCgnQ2FjaGUtQ29udHJvbCcpKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NhY2hlLUNvbnRyb2wnLCBnZXRDYWNoZUNvbnRyb2xIZWFkZXIoY2FjaGVFbnRyeS5jYWNoZUNvbnRyb2wpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIG5ldyBSZXNwb25zZShjYWNoZUVudHJ5LnZhbHVlLmJvZHksIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIHN0YXR1czogY2FjaGVFbnRyeS52YWx1ZS5zdGF0dXMgfHwgMjAwXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVE9ETzogYWN0aXZlU3BhbiBjb2RlIHBhdGggaXMgZm9yIHdoZW4gd3JhcHBlZCBieVxuICAgICAgICAvLyBuZXh0LXNlcnZlciBjYW4gYmUgcmVtb3ZlZCB3aGVuIHRoaXMgaXMgbm8gbG9uZ2VyIHVzZWRcbiAgICAgICAgaWYgKGFjdGl2ZVNwYW4pIHtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZVJlc3BvbnNlKGFjdGl2ZVNwYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgdHJhY2VyLndpdGhQcm9wYWdhdGVkQ29udGV4dChyZXEuaGVhZGVycywgKCk9PnRyYWNlci50cmFjZShCYXNlU2VydmVyU3Bhbi5oYW5kbGVSZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW5OYW1lOiBgJHttZXRob2R9ICR7cmVxLnVybH1gLFxuICAgICAgICAgICAgICAgICAgICBraW5kOiBTcGFuS2luZC5TRVJWRVIsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLm1ldGhvZCc6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLnRhcmdldCc6IHJlcS51cmxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGhhbmRsZVJlc3BvbnNlKSk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgTm9GYWxsYmFja0Vycm9yKSkge1xuICAgICAgICAgICAgYXdhaXQgcm91dGVNb2R1bGUub25SZXF1ZXN0RXJyb3IocmVxLCBlcnIsIHtcbiAgICAgICAgICAgICAgICByb3V0ZXJLaW5kOiAnQXBwIFJvdXRlcicsXG4gICAgICAgICAgICAgICAgcm91dGVQYXRoOiBub3JtYWxpemVkU3JjUGFnZSxcbiAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdyb3V0ZScsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogZ2V0UmV2YWxpZGF0ZVJlYXNvbih7XG4gICAgICAgICAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0aHJvdyBzbyB0aGF0IHdlIGNhbiBoYW5kbGUgc2VydmluZyBlcnJvciBwYWdlXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZHVyaW5nIHN0YXRpYyBnZW5lcmF0aW9uLCB0aHJvdyB0aGUgZXJyb3IgYWdhaW4uXG4gICAgICAgIGlmIChpc0lzcikgdGhyb3cgZXJyO1xuICAgICAgICAvLyBPdGhlcndpc2UsIHNlbmQgYSA1MDAgcmVzcG9uc2UuXG4gICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-agent%2Fexplain%2Froute&page=%2Fapi%2Fmenu-agent%2Fexplain%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-agent%2Fexplain%2Froute.ts&appDir=%2Fapp%2Fapplet%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Fapplet&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/menu-agent/explain/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/menu-agent/explain/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_gemini__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/gemini */ \"(rsc)/./src/lib/gemini.ts\");\n\n\nfunction isTransientHighDemandError(err) {\n    const message = err instanceof Error ? err.message : String(err);\n    return message.includes(\"high demand\") || message.includes(\"UNAVAILABLE\") || message.includes(\"503\");\n}\nfunction getHttpStatusFromGeminiError(err) {\n    const message = err instanceof Error ? err.message : String(err);\n    if (message.includes(\"GEMINI_API_KEY\") || isTransientHighDemandError(err)) {\n        return 503;\n    }\n    if (message.includes(\"RESOURCE_EXHAUSTED\") || message.includes(\"429\")) return 429;\n    if (message.includes(\"PERMISSION_DENIED\") || message.includes(\"API_KEY_INVALID\") || message.includes(\"401\") || message.includes(\"403\")) {\n        return 502;\n    }\n    return 500;\n}\nasync function POST(req) {\n    let body;\n    try {\n        body = await req.json();\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Invalid JSON request body.\"\n        }, {\n            status: 400\n        });\n    }\n    const dishName = (body.dishName || \"\").trim();\n    const dishNameAr = (body.dishNameAr || \"\").trim();\n    if (!dishName && !dishNameAr) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Dish name is required.\"\n        }, {\n            status: 400\n        });\n    }\n    const voiceName = (0,_lib_gemini__WEBPACK_IMPORTED_MODULE_1__.normalizeVoiceAgentVoice)(body.voiceName);\n    const question = (body.question || \"\").trim().slice(0, 300);\n    const restaurantLabel = (body.restaurantNameAr || \"\").trim() || (body.restaurantName || \"\").trim() || \"مطعمنا\";\n    const dishTitle = dishNameAr || dishName;\n    const dishDesc = (body.descriptionAr || \"\").trim() || (body.description || \"\").trim();\n    const allergensList = Array.isArray(body.allergens) ? body.allergens.filter(Boolean).slice(0, 10) : [];\n    const optionSummaries = Array.isArray(body.options) ? body.options.slice(0, 6).map((opt)=>opt?.name ? `${opt.name}: ${(opt.values || []).slice(0, 4).join(\"، \")}` : \"\").filter(Boolean) : [];\n    const dishPrompt = [\n        `المطعم: ${restaurantLabel}`,\n        `التصنيف: ${(body.categoryName || \"الأطباق\").trim()}`,\n        `اسم الطبق: ${dishTitle}${dishName && dishNameAr && dishName !== dishNameAr ? ` (${dishName})` : \"\"}`,\n        dishDesc ? `وصف الطبق: ${dishDesc}` : \"\",\n        typeof body.price === \"number\" ? `السعر: ${body.price} ${(body.currency || \"SAR\").trim()}` : \"\",\n        allergensList.length > 0 ? `مسببات الحساسية: ${allergensList.join(\"، \")}` : \"لا توجد مسببات حساسية مسجلة.\",\n        optionSummaries.length > 0 ? `الإضافات والخيارات المتاحة: ${optionSummaries.join(\" | \")}` : \"\",\n        question ? `سؤال الضيف: ${question}` : \"\"\n    ].filter(Boolean).join(\"\\n\");\n    const systemInstruction = [\n        \"أنت مضيف ومستشار ضيافة سعودي أصيل وودود في مطعم راقٍ.\",\n        \"مهمتك تشرح كل طبق للضيف باللهجة السعودية الطبيعية الدافئة (مثل: يا هلا والله، حياكم الله، أبشر، محضّر على أصوله، طعمه خيالي، يذوب بالفم، على كيف كيفك).\",\n        \"اكتب نصاً صوتياً جاهزاً للنطق مباشرة في ٣ إلى ٤ جمل قصيرة ومترابطة فقط.\",\n        \"إذا سأل الضيف سؤالاً محدداً، جاوبه أولاً بوضوح ولطف باللهجة السعودية ثم أضف نبذة شهية عن الطبق.\",\n        \"اشرح المكونات وطريقة التحضير والنكهات، واذكر مسببات الحساسية أو الخيارات المتوفرة إن وجدت بشكل طبيعي.\",\n        \"ممنوع تماماً استخدام الرموز التعبيرية الإيموجي، أو النقاط والتنسيقات مثل النجمات والشرطات، أو الأحرف الإنجليزية أو أي لغة غير العربية حتى يمكن قراءته صوتياً بسلاسة.\",\n        \"اكتب الأرقام أو العملات بالعربية إذا احتجتها (مثل ريال أو ريال سعودي).\"\n    ].join(\" \");\n    try {\n        const ai = (0,_lib_gemini__WEBPACK_IMPORTED_MODULE_1__.getGeminiServerClient)();\n        // 1) Generate authentic Saudi dialect culinary explanation (fallback to gemini-3.1-flash-lite on transient 503)\n        let textResponse;\n        try {\n            textResponse = await ai.models.generateContent({\n                model: \"gemini-4-hydrogen\",\n                contents: dishPrompt,\n                config: {\n                    systemInstruction,\n                    thinkingConfig: {\n                        thinkingLevel: _lib_gemini__WEBPACK_IMPORTED_MODULE_1__.ThinkingLevel.LOW\n                    }\n                }\n            });\n        } catch (textErr) {\n            if (!isTransientHighDemandError(textErr)) {\n                throw textErr;\n            }\n            textResponse = await ai.models.generateContent({\n                model: \"gemini-3.1-flash-lite\",\n                contents: dishPrompt,\n                config: {\n                    systemInstruction,\n                    thinkingConfig: {\n                        thinkingLevel: _lib_gemini__WEBPACK_IMPORTED_MODULE_1__.ThinkingLevel.LOW\n                    }\n                }\n            });\n        }\n        const scriptAr = (textResponse.text || \"\").replace(/[*#_`~>\\[\\]]/g, \"\").replace(/\\s+/g, \" \").trim();\n        if (!scriptAr) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Gemini returned an empty Saudi explanation script.\"\n            }, {\n                status: 502\n            });\n        }\n        // 2) Synthesize natural Saudi Arabic speech WAV via Gemini TTS (single retry on transient 503)\n        const ttsParams = {\n            model: \"gemini-3.8-flash-lite-tts\",\n            contents: [\n                {\n                    role: \"user\",\n                    parts: [\n                        {\n                            text: scriptAr,\n                            speechMetadata: {\n                                style: \"Warm, welcoming Saudi Arabian hospitality host speaking naturally in authentic Saudi Arabic dialect with clear pronunciation and appetizing warmth.\"\n                            }\n                        }\n                    ]\n                }\n            ],\n            config: {\n                responseModalities: [\n                    \"AUDIO\"\n                ],\n                speechConfig: {\n                    voiceConfig: {\n                        prebuiltVoiceConfig: {\n                            voiceName\n                        }\n                    }\n                }\n            }\n        };\n        let ttsResponse;\n        try {\n            ttsResponse = await ai.models.generateContent(ttsParams);\n        } catch (ttsErr) {\n            if (!isTransientHighDemandError(ttsErr)) {\n                throw ttsErr;\n            }\n            await new Promise((resolve)=>setTimeout(resolve, 600));\n            ttsResponse = await ai.models.generateContent(ttsParams);\n        }\n        const audioPart = ttsResponse.candidates?.[0]?.content?.parts?.find((part)=>part.inlineData?.data);\n        const audioBase64 = audioPart?.inlineData?.data;\n        const mimeType = audioPart?.inlineData?.mimeType || \"audio/wav\";\n        if (!audioBase64) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Gemini TTS did not return audio bytes for this dish explanation.\",\n                scriptAr\n            }, {\n                status: 502\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            scriptAr,\n            audioBase64,\n            mimeType,\n            voiceName\n        });\n    } catch (err) {\n        let message = err instanceof Error ? err.message : \"Failed to generate voice response.\";\n        try {\n            const parsed = JSON.parse(message);\n            if (parsed?.error?.message) {\n                message = parsed.error.message;\n            }\n        } catch  {\n        // Keep original error message string\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: message\n        }, {\n            status: getHttpStatusFromGeminiError(err)\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9tZW51LWFnZW50L2V4cGxhaW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXdEO0FBS2xDO0FBa0J0QixTQUFTSSwyQkFBMkJDLEdBQVk7SUFDOUMsTUFBTUMsVUFBVUQsZUFBZUUsUUFBUUYsSUFBSUMsT0FBTyxHQUFHRSxPQUFPSDtJQUM1RCxPQUNFQyxRQUFRRyxRQUFRLENBQUMsa0JBQ2pCSCxRQUFRRyxRQUFRLENBQUMsa0JBQ2pCSCxRQUFRRyxRQUFRLENBQUM7QUFFckI7QUFFQSxTQUFTQyw2QkFBNkJMLEdBQVk7SUFDaEQsTUFBTUMsVUFBVUQsZUFBZUUsUUFBUUYsSUFBSUMsT0FBTyxHQUFHRSxPQUFPSDtJQUM1RCxJQUFJQyxRQUFRRyxRQUFRLENBQUMscUJBQXFCTCwyQkFBMkJDLE1BQU07UUFDekUsT0FBTztJQUNUO0lBQ0EsSUFBSUMsUUFBUUcsUUFBUSxDQUFDLHlCQUF5QkgsUUFBUUcsUUFBUSxDQUFDLFFBQVEsT0FBTztJQUM5RSxJQUNFSCxRQUFRRyxRQUFRLENBQUMsd0JBQ2pCSCxRQUFRRyxRQUFRLENBQUMsc0JBQ2pCSCxRQUFRRyxRQUFRLENBQUMsVUFDakJILFFBQVFHLFFBQVEsQ0FBQyxRQUNqQjtRQUNBLE9BQU87SUFDVDtJQUNBLE9BQU87QUFDVDtBQUVPLGVBQWVFLEtBQUtDLEdBQWdCO0lBQ3pDLElBQUlDO0lBQ0osSUFBSTtRQUNGQSxPQUFRLE1BQU1ELElBQUlFLElBQUk7SUFDeEIsRUFBRSxPQUFNO1FBQ04sT0FBT2QscURBQVlBLENBQUNjLElBQUksQ0FDdEI7WUFBRUMsT0FBTztRQUE2QixHQUN0QztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7SUFFQSxNQUFNQyxXQUFXLENBQUNKLEtBQUtJLFFBQVEsSUFBSSxFQUFDLEVBQUdDLElBQUk7SUFDM0MsTUFBTUMsYUFBYSxDQUFDTixLQUFLTSxVQUFVLElBQUksRUFBQyxFQUFHRCxJQUFJO0lBQy9DLElBQUksQ0FBQ0QsWUFBWSxD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RUFBRSxDQUFDLEVBQUUsRUFBRUMsU0FBU2QsT0FBT2UsS0FDN0QsQ0FBQ0MsT0FBU0EsS0FBS0MsVUFBVSxFQUFFQztRQUU3QixNQUFNQyxjQUFjUCxXQUFXSyxZQUFZQztRQUMzQyxNQUFNRSxXQUFXUixXQUFXSyxZQUFZRyxZQUFZO1FBRXBELElBQUksQ0FBQ0QsYUFBYTtZQUNoQixPQUFPcEYscURBQVlBLENBQUNjLElBQUksQ0FDdEI7Z0JBQ0VDLE9BQ0U7Z0JBQ0Y2QztZQUNGLEdBQ0E7Z0JBQUU1QyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxPQUFPaEIscURBQVlBLENBQUNjLElBQUksQ0FBQztZQUN2QjhDO1lBQ0F3QjtZQUNBQztZQUNBakU7UUFDRjtJQUNGLEVBQUUsT0FBT2YsS0FBSztRQUNaLElBQUlDLFVBQ0ZELGVBQWVFLFFBQVFGLElBQUlDLE9BQU8sR0FBRztRQUN2QyxJQUFJO1lBQ0YsTUFBTWdGLFNBQVNDLEtBQUtDLEtBQUssQ0FBQ2xGO1lBRzFCLElBQUlnRixRQUFRdkUsT0FBT1QsU0FBUztnQkFDMUJBLFVBQVVnRixPQUFPdkUsS0FBSyxDQUFDVCxPQUFPO1lBQ2hDO1FBQ0YsRUFBRSxPQUFNO1FBQ04scUNBQXFDO1FBQ3ZDO1FBQ0EsT0FBT04scURBQVlBLENBQUNjLElBQUksQ0FDdEI7WUFBRUMsT0FBT1Q7UUFBUSxHQUNqQjtZQUFFVSxRQUFRTiw2QkFBNkJMO1FBQUs7SUFFaEQ7QUFDRiIsInNvdXJjZXMiOlsiL2FwcC9hcHBsZXQvc3JjL2FwcC9hcGkvbWVudS1hZ2VudC9leHBsYWluL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7XG4gIFRoaW5raW5nTGV2ZWwsXG4gIGdldEdlbWluaVNlcnZlckNsaWVudCxcbiAgbm9ybWFsaXplVm9pY2VBZ2VudFZvaWNlLFxufSBmcm9tIFwiQC9saWIvZ2VtaW5pXCI7XG5cbmludGVyZmFjZSBFeHBsYWluUmVxdWVzdEJvZHkge1xuICBkaXNoTmFtZT86IHN0cmluZztcbiAgZGlzaE5hbWVBcj86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uQXI/OiBzdHJpbmc7XG4gIGNhdGVnb3J5TmFtZT86IHN0cmluZztcbiAgcHJpY2U/OiBudW1iZXI7XG4gIGN1cnJlbmN5Pzogc3RyaW5nO1xuICBhbGxlcmdlbnM/OiBzdHJpbmdbXTtcbiAgb3B0aW9ucz86IEFycmF5PHsgbmFtZT86IHN0cmluZzsgdmFsdWVzPzogc3RyaW5nW10gfT47XG4gIHJlc3RhdXJhbnROYW1lPzogc3RyaW5nO1xuICByZXN0YXVyYW50TmFtZUFyPzogc3RyaW5nO1xuICBxdWVzdGlvbj86IHN0cmluZztcbiAgdm9pY2VOYW1lPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBpc1RyYW5zaWVudEhpZ2hEZW1hbmRFcnJvcihlcnI6IHVua25vd24pOiBib29sZWFuIHtcbiAgY29uc3QgbWVzc2FnZSA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcbiAgcmV0dXJuIChcbiAgICBtZXNzYWdlLmluY2x1ZGVzKFwiaGlnaCBkZW1hbmRcIikgfHxcbiAgICBtZXNzYWdlLmluY2x1ZGVzKFwiVU5BVkFJTEFCTEVcIikgfHxcbiAgICBtZXNzYWdlLmluY2x1ZGVzKFwiNTAzXCIpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldEh0dHBTdGF0dXNGcm9tR2VtaW5pRXJyb3IoZXJyOiB1bmtub3duKTogbnVtYmVyIHtcbiAgY29uc3QgbWVzc2FnZSA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcbiAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoXCJHRU1JTklfQVBJX0tFWVwiKSB8fCBpc1RyYW5zaWVudEhpZ2hEZW1hbmRFcnJvcihlcnIpKSB7XG4gICAgcmV0dXJuIDUwMztcbiAgfVxuICBpZiAobWVzc2FnZS5pbmNsdWRlcyhcIlJFU09VUkNFX0VYSEFVU1RFRFwiKSB8fCBtZXNzYWdlLmluY2x1ZGVzKFwiNDI5XCIpKSByZXR1cm4gNDI5O1xuICBpZiAoXG4gICAgbWVzc2FnZS5pbmNsdWRlcyhcIlBFUk1JU1NJT05fREVOSUVEXCIpIHx8XG4gICAgbWVzc2FnZS5pbmNsdWRlcyhcIkFQSV9LRVlfSU5WQUxJRFwiKSB8fFxuICAgIG1lc3NhZ2UuaW5jbHVkZXMoXCI0MDFcIikgfHxcbiAgICBtZXNzYWdlLmluY2x1ZGVzKFwiNDAzXCIpXG4gICkge1xuICAgIHJldHVybiA1MDI7XG4gIH1cbiAgcmV0dXJuIDUwMDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICBsZXQgYm9keTogRXhwbGFpblJlcXVlc3RCb2R5O1xuICB0cnkge1xuICAgIGJvZHkgPSAoYXdhaXQgcmVxLmpzb24oKSkgYXMgRXhwbGFpblJlcXVlc3RCb2R5O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkludmFsaWQgSlNPTiByZXF1ZXN0IGJvZHkuXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICk7XG4gIH1cblxuICBjb25zdCBkaXNoTmFtZSA9IChib2R5LmRpc2hOYW1lIHx8IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgZGlzaE5hbWVBciA9IChib2R5LmRpc2hOYW1lQXIgfHwgXCJcIikudHJpbSgpO1xuICBpZiAoIWRpc2hOYW1lICYmICFkaXNoTmFtZUFyKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJEaXNoIG5hbWUgaXMgcmVxdWlyZWQuXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICk7XG4gIH1cblxuICBjb25zdCB2b2ljZU5hbWUgPSBub3JtYWxpemVWb2ljZUFnZW50Vm9pY2UoYm9keS52b2ljZU5hbWUpO1xuICBjb25zdCBxdWVzdGlvbiA9IChib2R5LnF1ZXN0aW9uIHx8IFwiXCIpLnRyaW0oKS5zbGljZSgwLCAzMDApO1xuXG4gIGNvbnN0IHJlc3RhdXJhbnRMYWJlbCA9XG4gICAgKGJvZHkucmVzdGF1cmFudE5hbWVBciB8fCBcIlwiKS50cmltKCkgfHxcbiAgICAoYm9keS5yZXN0YXVyYW50TmFtZSB8fCBcIlwiKS50cmltKCkgfHxcbiAgICBcItmF2LfYudmF2YbYp1wiO1xuICBjb25zdCBkaXNoVGl0bGUgPSBkaXNoTmFtZUFyIHx8IGRpc2hOYW1lO1xuICBjb25zdCBkaXNoRGVzYyA9XG4gICAgKGJvZHkuZGVzY3JpcHRpb25BciB8fCBcIlwiKS50cmltKCkgfHwgKGJvZHkuZGVzY3JpcHRpb24gfHwgXCJcIikudHJpbSgpO1xuICBjb25zdCBhbGxlcmdlbnNMaXN0ID0gQXJyYXkuaXNBcnJheShib2R5LmFsbGVyZ2VucylcbiAgICA/IGJvZHkuYWxsZXJnZW5zLmZpbHRlcihCb29sZWFuKS5zbGljZSgwLCAxMClcbiAgICA6IFtdO1xuICBjb25zdCBvcHRpb25TdW1tYXJpZXMgPSBBcnJheS5pc0FycmF5KGJvZHkub3B0aW9ucylcbiAgICA/IGJvZHkub3B0aW9uc1xuICAgICAgICAuc2xpY2UoMCwgNilcbiAgICAgICAgLm1hcCgob3B0KSA9PlxuICAgICAgICAgIG9wdD8ubmFtZVxuICAgICAgICAgICAgPyBgJHtvcHQubmFtZX06ICR7KG9wdC52YWx1ZXMgfHwgW10pLnNsaWNlKDAsIDQpLmpvaW4oXCLYjCBcIil9YFxuICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgIClcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgIDogW107XG5cbiAgY29uc3QgZGlzaFByb21wdCA9IFtcbiAgICBg2KfZhNmF2LfYudmFOiAke3Jlc3RhdXJhbnRMYWJlbH1gLFxuICAgIGDYp9mE2KrYtdmG2YrZgTogJHsoYm9keS5jYXRlZ29yeU5hbWUgfHwgXCLYp9mE2KPYt9io2KfZglwiKS50cmltKCl9YCxcbiAgICBg2KfYs9mFINin2YTYt9io2YI6ICR7ZGlzaFRpdGxlfSR7ZGlzaE5hbWUgJiYgZGlzaE5hbWVBciAmJiBkaXNoTmFtZSAhPT0gZGlzaE5hbWVBciA/IGAgKCR7ZGlzaE5hbWV9KWAgOiBcIlwifWAsXG4gICAgZGlzaERlc2MgPyBg2YjYtdmBINin2YTYt9io2YI6ICR7ZGlzaERlc2N9YCA6IFwiXCIsXG4gICAgdHlwZW9mIGJvZHkucHJpY2UgPT09IFwibnVtYmVyXCJcbiAgICAgID8gYNin2YTYs9i52LE6ICR7Ym9keS5wcmljZX0gJHsoYm9keS5jdXJyZW5jeSB8fCBcIlNBUlwiKS50cmltKCl9YFxuICAgICAgOiBcIlwiLFxuICAgIGFsbGVyZ2Vuc0xpc3QubGVuZ3RoID4gMFxuICAgICAgPyBg2YXYs9io2KjYp9iqINin2YTYrdiz2KfYs9mK2Kk6ICR7YWxsZXJnZW5zTGlzdC5qb2luKFwi2IwgXCIpfWBcbiAgICAgIDogXCLZhNinINiq2YjYrNivINmF2LPYqNio2KfYqiDYrdiz2KfYs9mK2Kkg2YXYs9is2YTYqS5cIixcbiAgICBvcHRpb25TdW1tYXJpZXMubGVuZ3RoID4gMFxuICAgICAgPyBg2KfZhNil2LbYp9mB2KfYqiDZiNin2YTYrtmK2KfYsdin2Kog2KfZhNmF2KrYp9it2Kk6ICR7b3B0aW9uU3VtbWFyaWVzLmpvaW4oXCIgfCBcIil9YFxuICAgICAgOiBcIlwiLFxuICAgIHF1ZXN0aW9uID8gYNiz2KTYp9mEINin2YTYttmK2YE6ICR7cXVlc3Rpb259YCA6IFwiXCIsXG4gIF1cbiAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgLmpvaW4oXCJcXG5cIik7XG5cbiAgY29uc3Qgc3lzdGVtSW5zdHJ1Y3Rpb24gPSBbXG4gICAgXCLYo9mG2Kog2YXYttmK2YEg2YjZhdiz2KrYtNin2LEg2LbZitin2YHYqSDYs9i52YjYr9mKINij2LXZitmEINmI2YjYr9mI2K8g2YHZiiDZhdi32LnZhSDYsdin2YLZjS5cIixcbiAgICBcItmF2YfZhdiq2YMg2KrYtNix2K0g2YPZhCDYt9io2YIg2YTZhNi22YrZgSDYqNin2YTZhNmH2KzYqSDYp9mE2LPYudmI2K/ZitipINin2YTYt9io2YrYudmK2Kkg2KfZhNiv2KfZgdim2KkgKNmF2KvZhDog2YrYpyDZh9mE2Kcg2YjYp9mE2YTZh9iMINit2YrYp9mD2YUg2KfZhNmE2YfYjCDYo9io2LTYsdiMINmF2K3YttmR2LEg2LnZhNmJINij2LXZiNmE2YfYjCDYt9i52YXZhyDYrtmK2KfZhNmK2Iwg2YrYsNmI2Kgg2KjYp9mE2YHZhdiMINi52YTZiSDZg9mK2YEg2YPZitmB2YMpLlwiLFxuICAgIFwi2KfZg9iq2Kgg2YbYtdin2Ysg2LXZiNiq2YrYp9mLINis2KfZh9iy2KfZiyDZhNmE2YbYt9mCINmF2KjYp9i02LHYqSDZgdmKINmjINil2YTZiSDZpCDYrNmF2YQg2YLYtdmK2LHYqSDZiNmF2KrYsdin2KjYt9ipINmB2YLYty5cIixcbiAgICBcItil2LDYpyDYs9ij2YQg2KfZhNi22YrZgSDYs9ik2KfZhNin2Ysg2YXYrdiv2K/Yp9mL2Iwg2KzYp9mI2KjZhyDYo9mI2YTYp9mLINio2YjYttmI2K0g2YjZhNi32YEg2KjYp9mE2YTZh9is2Kkg2KfZhNiz2LnZiNiv2YrYqSDYq9mFINij2LbZgSDZhtio2LDYqSDYtNmH2YrYqSDYudmGINin2YTYt9io2YIuXCIsXG4gICAgXCLYp9i02LHYrSDYp9mE2YXZg9mI2YbYp9iqINmI2LfYsdmK2YLYqSDYp9mE2KrYrdi22YrYsSDZiNin2YTZhtmD2YfYp9iq2Iwg2YjYp9iw2YPYsSDZhdiz2KjYqNin2Kog2KfZhNit2LPYp9iz2YrYqSDYo9mIINin2YTYrtmK2KfYsdin2Kog2KfZhNmF2KrZiNmB2LHYqSDYpdmGINmI2KzYr9iqINio2LTZg9mEINi32KjZiti52YouXCIsXG4gICAgXCLZhdmF2YbZiNi5INiq2YXYp9mF2KfZiyDYp9iz2KrYrtiv2KfZhSDYp9mE2LHZhdmI2LIg2KfZhNiq2LnYqNmK2LHZitipINin2YTYpdmK2YXZiNis2YrYjCDYo9mIINin2YTZhtmC2KfYtyDZiNin2YTYqtmG2LPZitmC2KfYqiDZhdir2YQg2KfZhNmG2KzZhdin2Kog2YjYp9mE2LTYsdi32KfYqtiMINij2Ygg2KfZhNij2K3YsdmBINin2YTYpdmG2KzZhNmK2LLZitipINij2Ygg2KPZiiDZhNi62Kkg2LrZitixINin2YTYudix2KjZitipINit2KrZiSDZitmF2YPZhiDZgtix2KfYodiq2Ycg2LXZiNiq2YrYp9mLINio2LPZhNin2LPYqS5cIixcbiAgICBcItin2YPYqtioINin2YTYo9ix2YLYp9mFINij2Ygg2KfZhNi52YXZhNin2Kog2KjYp9mE2LnYsdio2YrYqSDYpdiw2Kcg2KfYrdiq2KzYqtmH2KcgKNmF2KvZhCDYsdmK2KfZhCDYo9mIINix2YrYp9mEINiz2LnZiNiv2YopLlwiLFxuICBdLmpvaW4oXCIgXCIpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYWkgPSBnZXRHZW1pbmlTZXJ2ZXJDbGllbnQoKTtcblxuICAgIC8vIDEpIEdlbmVyYXRlIGF1dGhlbnRpYyBTYXVkaSBkaWFsZWN0IGN1bGluYXJ5IGV4cGxhbmF0aW9uIChmYWxsYmFjayB0byBnZW1pbmktMy4xLWZsYXNoLWxpdGUgb24gdHJhbnNpZW50IDUwMylcbiAgICBsZXQgdGV4dFJlc3BvbnNlO1xuICAgIHRyeSB7XG4gICAgICB0ZXh0UmVzcG9uc2UgPSBhd2FpdCBhaS5tb2RlbHMuZ2VuZXJhdGVDb250ZW50KHtcbiAgICAgICAgbW9kZWw6IFwiZ2VtaW5pLTQtaHlkcm9nZW5cIixcbiAgICAgICAgY29udGVudHM6IGRpc2hQcm9tcHQsXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIHN5c3RlbUluc3RydWN0aW9uLFxuICAgICAgICAgIHRoaW5raW5nQ29uZmlnOiB7XG4gICAgICAgICAgICB0aGlua2luZ0xldmVsOiBUaGlua2luZ0xldmVsLkxPVyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAodGV4dEVycikge1xuICAgICAgaWYgKCFpc1RyYW5zaWVudEhpZ2hEZW1hbmRFcnJvcih0ZXh0RXJyKSkge1xuICAgICAgICB0aHJvdyB0ZXh0RXJyO1xuICAgICAgfVxuICAgICAgdGV4dFJlc3BvbnNlID0gYXdhaXQgYWkubW9kZWxzLmdlbmVyYXRlQ29udGVudCh7XG4gICAgICAgIG1vZGVsOiBcImdlbWluaS0zLjEtZmxhc2gtbGl0ZVwiLFxuICAgICAgICBjb250ZW50czogZGlzaFByb21wdCxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgc3lzdGVtSW5zdHJ1Y3Rpb24sXG4gICAgICAgICAgdGhpbmtpbmdDb25maWc6IHtcbiAgICAgICAgICAgIHRoaW5raW5nTGV2ZWw6IFRoaW5raW5nTGV2ZWwuTE9XLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JpcHRBciA9ICh0ZXh0UmVzcG9uc2UudGV4dCB8fCBcIlwiKVxuICAgICAgLnJlcGxhY2UoL1sqI19gfj5cXFtcXF1dL2csIFwiXCIpXG4gICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgIC50cmltKCk7XG5cbiAgICBpZiAoIXNjcmlwdEFyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiR2VtaW5pIHJldHVybmVkIGFuIGVtcHR5IFNhdWRpIGV4cGxhbmF0aW9uIHNjcmlwdC5cIiB9LFxuICAgICAgICB7IHN0YXR1czogNTAyIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gMikgU3ludGhlc2l6ZSBuYXR1cmFsIFNhdWRpIEFyYWJpYyBzcGVlY2ggV0FWIHZpYSBHZW1pbmkgVFRTIChzaW5nbGUgcmV0cnkgb24gdHJhbnNpZW50IDUwMylcbiAgICBjb25zdCB0dHNQYXJhbXMgPSB7XG4gICAgICBtb2RlbDogXCJnZW1pbmktMy44LWZsYXNoLWxpdGUtdHRzXCIsXG4gICAgICBjb250ZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgcGFydHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogc2NyaXB0QXIsXG4gICAgICAgICAgICAgIHNwZWVjaE1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3R5bGU6XG4gICAgICAgICAgICAgICAgICBcIldhcm0sIHdlbGNvbWluZyBTYXVkaSBBcmFiaWFuIGhvc3BpdGFsaXR5IGhvc3Qgc3BlYWtpbmcgbmF0dXJhbGx5IGluIGF1dGhlbnRpYyBTYXVkaSBBcmFiaWMgZGlhbGVjdCB3aXRoIGNsZWFyIHByb251bmNpYXRpb24gYW5kIGFwcGV0aXppbmcgd2FybXRoLlwiLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICByZXNwb25zZU1vZGFsaXRpZXM6IFtcIkFVRElPXCJdLFxuICAgICAgICBzcGVlY2hDb25maWc6IHtcbiAgICAgICAgICB2b2ljZUNvbmZpZzoge1xuICAgICAgICAgICAgcHJlYnVpbHRWb2ljZUNvbmZpZzoge1xuICAgICAgICAgICAgICB2b2ljZU5hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBsZXQgdHRzUmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIHR0c1Jlc3BvbnNlID0gYXdhaXQgYWkubW9kZWxzLmdlbmVyYXRlQ29udGVudCh0dHNQYXJhbXMpO1xuICAgIH0gY2F0Y2ggKHR0c0Vycikge1xuICAgICAgaWYgKCFpc1RyYW5zaWVudEhpZ2hEZW1hbmRFcnJvcih0dHNFcnIpKSB7XG4gICAgICAgIHRocm93IHR0c0VycjtcbiAgICAgIH1cbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDYwMCkpO1xuICAgICAgdHRzUmVzcG9uc2UgPSBhd2FpdCBhaS5tb2RlbHMuZ2VuZXJhdGVDb250ZW50KHR0c1BhcmFtcyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXVkaW9QYXJ0ID0gdHRzUmVzcG9uc2UuY2FuZGlkYXRlcz8uWzBdPy5jb250ZW50Py5wYXJ0cz8uZmluZChcbiAgICAgIChwYXJ0KSA9PiBwYXJ0LmlubGluZURhdGE/LmRhdGFcbiAgICApO1xuICAgIGNvbnN0IGF1ZGlvQmFzZTY0ID0gYXVkaW9QYXJ0Py5pbmxpbmVEYXRhPy5kYXRhO1xuICAgIGNvbnN0IG1pbWVUeXBlID0gYXVkaW9QYXJ0Py5pbmxpbmVEYXRhPy5taW1lVHlwZSB8fCBcImF1ZGlvL3dhdlwiO1xuXG4gICAgaWYgKCFhdWRpb0Jhc2U2NCkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7XG4gICAgICAgICAgZXJyb3I6XG4gICAgICAgICAgICBcIkdlbWluaSBUVFMgZGlkIG5vdCByZXR1cm4gYXVkaW8gYnl0ZXMgZm9yIHRoaXMgZGlzaCBleHBsYW5hdGlvbi5cIixcbiAgICAgICAgICBzY3JpcHRBcixcbiAgICAgICAgfSxcbiAgICAgICAgeyBzdGF0dXM6IDUwMiB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBzY3JpcHRBcixcbiAgICAgIGF1ZGlvQmFzZTY0LFxuICAgICAgbWltZVR5cGUsXG4gICAgICB2b2ljZU5hbWUsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxldCBtZXNzYWdlID1cbiAgICAgIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBnZW5lcmF0ZSB2b2ljZSByZXNwb25zZS5cIjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShtZXNzYWdlKSBhcyB7XG4gICAgICAgIGVycm9yPzogeyBtZXNzYWdlPzogc3RyaW5nIH07XG4gICAgICB9O1xuICAgICAgaWYgKHBhcnNlZD8uZXJyb3I/Lm1lc3NhZ2UpIHtcbiAgICAgICAgbWVzc2FnZSA9IHBhcnNlZC5lcnJvci5tZXNzYWdlO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gS2VlcCBvcmlnaW5hbCBlcnJvciBtZXNzYWdlIHN0cmluZ1xuICAgIH1cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBtZXNzYWdlIH0sXG4gICAgICB7IHN0YXR1czogZ2V0SHR0cFN0YXR1c0Zyb21HZW1pbmlFcnJvcihlcnIpIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiVGhpbmtpbmdMZXZlbCIsImdldEdlbWluaVNlcnZlckNsaWVudCIsIm5vcm1hbGl6ZVZvaWNlQWdlbnRWb2ljZSIsImlzVHJhbnNpZW50SGlnaERlbWFuZEVycm9yIiwiZXJyIiwibWVzc2FnZSIsIkVycm9yIiwiU3RyaW5nIiwiaW5jbHVkZXMiLCJnZXRIdHRwU3RhdHVzRnJvbUdlbWluaUVycm9yIiwiUE9TVCIsInJlcSIsImJvZHkiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJkaXNoTmFtZSIsInRyaW0iLCJkaXNoTmFtZUFyIiwidm9pY2VOYW1lIiwicXVlc3Rpb24iLCJzbGljZSIsInJlc3RhdXJhbnRMYWJlbCIsInJlc3RhdXJhbnROYW1lQXIiLCJyZXN0YXVyYW50TmFtZSIsImRpc2hUaXRsZSIsImRpc2hEZXNjIiwiZGVzY3JpcHRpb25BciIsImRlc2NyaXB0aW9uIiwiYWxsZXJnZW5zTGlzdCIsIkFycmF5IiwiaXNBcnJheSIsImFsbGVyZ2VucyIsImZpbHRlciIsIkJvb2xlYW4iLCJvcHRpb25TdW1tYXJpZXMiLCJvcHRpb25zIiwibWFwIiwib3B0IiwibmFtZSIsInZhbHVlcyIsImpvaW4iLCJkaXNoUHJvbXB0IiwiY2F0ZWdvcnlOYW1lIiwicHJpY2UiLCJjdXJyZW5jeSIsImxlbmd0aCIsInN5c3RlbUluc3RydWN0aW9uIiwiYWkiLCJ0ZXh0UmVzcG9uc2UiLCJtb2RlbHMiLCJnZW5lcmF0ZUNvbnRlbnQiLCJtb2RlbCIsImNvbnRlbnRzIiwiY29uZmlnIiwidGhpbmtpbmdDb25maWciLCJ0aGlua2luZ0xldmVsIiwiTE9XIiwidGV4dEVyciIsInNjcmlwdEFyIiwidGV4dCIsInJlcGxhY2UiLCJ0dHNQYXJhbXMiLCJyb2xlIiwicGFydHMiLCJzcGVlY2hNZXRhZGF0YSIsInN0eWxlIiwicmVzcG9uc2VNb2RhbGl0aWVzIiwic3BlZWNoQ29uZmlnIiwidm9pY2VDb25maWciLCJwcmVidWlsdFZvaWNlQ29uZmlnIiwidHRzUmVzcG9uc2UiLCJ0dHNFcnIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJhdWRpb1BhcnQiLCJjYW5kaWRhdGVzIiwiY29udGVudCIsImZpbmQiLCJwYXJ0IiwiaW5saW5lRGF0YSIsImRhdGEiLCJhdWRpb0Jhc2U2NCIsIm1pbWVUeXBlIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/menu-agent/explain/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/gemini.ts":
/*!***************************!*\
  !*** ./src/lib/gemini.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThinkingLevel: () => (/* reexport safe */ _google_genai__WEBPACK_IMPORTED_MODULE_0__.ThinkingLevel),\n/* harmony export */   VALID_VOICE_AGENT_VOICES: () => (/* binding */ VALID_VOICE_AGENT_VOICES),\n/* harmony export */   VOICE_AGENT_VOICE_LABELS: () => (/* binding */ VOICE_AGENT_VOICE_LABELS),\n/* harmony export */   getGeminiServerClient: () => (/* binding */ getGeminiServerClient),\n/* harmony export */   normalizeVoiceAgentVoice: () => (/* binding */ normalizeVoiceAgentVoice)\n/* harmony export */ });\n/* harmony import */ var _google_genai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google/genai */ \"(rsc)/./node_modules/@google/genai/dist/node/index.mjs\");\n\nconst VALID_VOICE_AGENT_VOICES = [\n    \"Kore\",\n    \"Charon\",\n    \"Puck\",\n    \"Fenrir\",\n    \"Zephyr\"\n];\nconst VOICE_AGENT_VOICE_LABELS = {\n    Kore: {\n        label: \"Kore · Warm Hostess\",\n        labelAr: \"كوري · صوت نسائي ترحيبي دافئ\",\n        tone: \"Warm & welcoming hospitality host\"\n    },\n    Charon: {\n        label: \"Charon · Deep Chef\",\n        labelAr: \"كارون · صوت رجالي رزين وعميق\",\n        tone: \"Deep, refined head-chef presence\"\n    },\n    Puck: {\n        label: \"Puck · Lively Host\",\n        labelAr: \"باك · صوت شبابي حيوي وودود\",\n        tone: \"Energetic, friendly dining host\"\n    },\n    Fenrir: {\n        label: \"Fenrir · Expressive Chef\",\n        labelAr: \"فنرير · صوت رجالي واثق وحماسي\",\n        tone: \"Bold, enthusiastic culinary storyteller\"\n    },\n    Zephyr: {\n        label: \"Zephyr · Calm Concierge\",\n        labelAr: \"زيفير · صوت هادئ وراقٍ\",\n        tone: \"Calm, refined fine-dining concierge\"\n    }\n};\nfunction normalizeVoiceAgentVoice(input) {\n    if (input && VALID_VOICE_AGENT_VOICES.includes(input)) {\n        return input;\n    }\n    return \"Kore\";\n}\nfunction getGeminiServerClient(apiVersion = \"v1beta\") {\n    const apiKey = (process.env.GEMINI_API_KEY || \"\").trim().replace(/^[\"']|[\"']$/g, \"\");\n    if (!apiKey || apiKey === \"MY_GEMINI_API_KEY\") {\n        throw new Error(\"GEMINI_API_KEY is not configured in the server environment yet.\");\n    }\n    return new _google_genai__WEBPACK_IMPORTED_MODULE_0__.GoogleGenAI({\n        apiKey,\n        apiVersion,\n        httpOptions: {\n            headers: {\n                \"User-Agent\": \"aistudio-build\"\n            }\n        }\n    });\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2dlbWluaS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMkQ7QUFHcEQsTUFBTUUsMkJBQThDO0lBQ3pEO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7Q0FDRCxDQUFDO0FBRUssTUFBTUMsMkJBR1Q7SUFDRkMsTUFBTTtRQUNKQyxPQUFPO1FBQ1BDLFNBQVM7UUFDVEMsTUFBTTtJQUNSO0lBQ0FDLFFBQVE7UUFDTkgsT0FBTztRQUNQQyxTQUFTO1FBQ1RDLE1BQU07SUFDUjtJQUNBRSxNQUFNO1FBQ0pKLE9BQU87UUFDUEMsU0FBUztRQUNUQyxNQUFNO0lBQ1I7SUFDQUcsUUFBUTtRQUNOTCxPQUFPO1FBQ1BDLFNBQVM7UUFDVEMsTUFBTTtJQUNSO0lBQ0FJLFFBQVE7UUFDTk4sT0FBTztRQUNQQyxTQUFTO1FBQ1RDLE1BQU07SUFDUjtBQUNGLEVBQUU7QUFFSyxTQUFTSyx5QkFBeUJDLEtBQXFCO0lBQzVELElBQUlBLFNBQVMseUJBQXVDQyxRQUFRLENBQUNELFFBQVE7UUFDbkUsT0FBT0E7SUFDVDtJQUNBLE9BQU87QUFDVDtBQUVPLFNBQVNFLHNCQUFzQkMsYUFBYSxRQUFRO0lBQ3pELE1BQU1DLFNBQVMsQ0FBQ0MsUUFBUUMsR0FBRyxDQUFDQyxjQUFjLElBQUksRUFBQyxFQUM1Q0MsSUFBSSxHQUNKQyxPQUFPLENBQUMsZ0JBQWdCO0lBQzNCLElBQUksQ0FBQ0wsVUFBVUEsV0FBVyxxQkFBcUI7UUFDN0MsTUFBTSxJQUFJTSxNQUNSO0lBRUo7SUFDQSxPQUFPLElBQUl2QixzREFBV0EsQ0FBQztRQUNyQmlCO1FBQ0FEO1FBQ0FRLGFBQWE7WUFDWEMsU0FBUztnQkFDUCxjQUFjO1lBQ2hCO1FBQ0Y7SUFDRjtBQUNGO0FBRXlCIiwic291cmNlcyI6WyIvYXBwL2FwcGxldC9zcmMvbGliL2dlbWluaS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHb29nbGVHZW5BSSwgVGhpbmtpbmdMZXZlbCB9IGZyb20gXCJAZ29vZ2xlL2dlbmFpXCI7XG5pbXBvcnQgdHlwZSB7IFZvaWNlQWdlbnRWb2ljZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBWQUxJRF9WT0lDRV9BR0VOVF9WT0lDRVM6IFZvaWNlQWdlbnRWb2ljZVtdID0gW1xuICBcIktvcmVcIixcbiAgXCJDaGFyb25cIixcbiAgXCJQdWNrXCIsXG4gIFwiRmVucmlyXCIsXG4gIFwiWmVwaHlyXCIsXG5dO1xuXG5leHBvcnQgY29uc3QgVk9JQ0VfQUdFTlRfVk9JQ0VfTEFCRUxTOiBSZWNvcmQ8XG4gIFZvaWNlQWdlbnRWb2ljZSxcbiAgeyBsYWJlbDogc3RyaW5nOyBsYWJlbEFyOiBzdHJpbmc7IHRvbmU6IHN0cmluZyB9XG4+ID0ge1xuICBLb3JlOiB7XG4gICAgbGFiZWw6IFwiS29yZSDCtyBXYXJtIEhvc3Rlc3NcIixcbiAgICBsYWJlbEFyOiBcItmD2YjYsdmKIMK3INi12YjYqiDZhtiz2KfYptmKINiq2LHYrdmK2KjZiiDYr9in2YHYplwiLFxuICAgIHRvbmU6IFwiV2FybSAmIHdlbGNvbWluZyBob3NwaXRhbGl0eSBob3N0XCIsXG4gIH0sXG4gIENoYXJvbjoge1xuICAgIGxhYmVsOiBcIkNoYXJvbiDCtyBEZWVwIENoZWZcIixcbiAgICBsYWJlbEFyOiBcItmD2KfYsdmI2YYgwrcg2LXZiNiqINix2KzYp9mE2Yog2LHYstmK2YYg2YjYudmF2YrZglwiLFxuICAgIHRvbmU6IFwiRGVlcCwgcmVmaW5lZCBoZWFkLWNoZWYgcHJlc2VuY2VcIixcbiAgfSxcbiAgUHVjazoge1xuICAgIGxhYmVsOiBcIlB1Y2sgwrcgTGl2ZWx5IEhvc3RcIixcbiAgICBsYWJlbEFyOiBcItio2KfZgyDCtyDYtdmI2Kog2LTYqNin2KjZiiDYrdmK2YjZiiDZiNmI2K/ZiNivXCIsXG4gICAgdG9uZTogXCJFbmVyZ2V0aWMsIGZyaWVuZGx5IGRpbmluZyBob3N0XCIsXG4gIH0sXG4gIEZlbnJpcjoge1xuICAgIGxhYmVsOiBcIkZlbnJpciDCtyBFeHByZXNzaXZlIENoZWZcIixcbiAgICBsYWJlbEFyOiBcItmB2YbYsdmK2LEgwrcg2LXZiNiqINix2KzYp9mE2Yog2YjYp9ir2YIg2YjYrdmF2KfYs9mKXCIsXG4gICAgdG9uZTogXCJCb2xkLCBlbnRodXNpYXN0aWMgY3VsaW5hcnkgc3Rvcnl0ZWxsZXJcIixcbiAgfSxcbiAgWmVwaHlyOiB7XG4gICAgbGFiZWw6IFwiWmVwaHlyIMK3IENhbG0gQ29uY2llcmdlXCIsXG4gICAgbGFiZWxBcjogXCLYstmK2YHZitixIMK3INi12YjYqiDZh9in2K/YpiDZiNix2KfZgtmNXCIsXG4gICAgdG9uZTogXCJDYWxtLCByZWZpbmVkIGZpbmUtZGluaW5nIGNvbmNpZXJnZVwiLFxuICB9LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVZvaWNlQWdlbnRWb2ljZShpbnB1dD86IHN0cmluZyB8IG51bGwpOiBWb2ljZUFnZW50Vm9pY2Uge1xuICBpZiAoaW5wdXQgJiYgKFZBTElEX1ZPSUNFX0FHRU5UX1ZPSUNFUyBhcyBzdHJpbmdbXSkuaW5jbHVkZXMoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGlucHV0IGFzIFZvaWNlQWdlbnRWb2ljZTtcbiAgfVxuICByZXR1cm4gXCJLb3JlXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZW1pbmlTZXJ2ZXJDbGllbnQoYXBpVmVyc2lvbiA9IFwidjFiZXRhXCIpOiBHb29nbGVHZW5BSSB7XG4gIGNvbnN0IGFwaUtleSA9IChwcm9jZXNzLmVudi5HRU1JTklfQVBJX0tFWSB8fCBcIlwiKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvXltcIiddfFtcIiddJC9nLCBcIlwiKTtcbiAgaWYgKCFhcGlLZXkgfHwgYXBpS2V5ID09PSBcIk1ZX0dFTUlOSV9BUElfS0VZXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkdFTUlOSV9BUElfS0VZIGlzIG5vdCBjb25maWd1cmVkIGluIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQgeWV0LlwiXG4gICAgKTtcbiAgfVxuICByZXR1cm4gbmV3IEdvb2dsZUdlbkFJKHtcbiAgICBhcGlLZXksXG4gICAgYXBpVmVyc2lvbixcbiAgICBodHRwT3B0aW9uczoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIlVzZXItQWdlbnRcIjogXCJhaXN0dWRpby1idWlsZFwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IHsgVGhpbmtpbmdMZXZlbCB9O1xuIl0sIm5hbWVzIjpbIkdvb2dsZUdlbkFJIiwiVGhpbmtpbmdMZXZlbCIsIlZBTElEX1ZPSUNFX0FHRU5UX1ZPSUNFUyIsIlZPSUNFX0FHRU5UX1ZPSUNFX0xBQkVMUyIsIktvcmUiLCJsYWJlbCIsImxhYmVsQXIiLCJ0b25lIiwiQ2hhcm9uIiwiUHVjayIsIkZlbnJpciIsIlplcGh5ciIsIm5vcm1hbGl6ZVZvaWNlQWdlbnRWb2ljZSIsImlucHV0IiwiaW5jbHVkZXMiLCJnZXRHZW1pbmlTZXJ2ZXJDbGllbnQiLCJhcGlWZXJzaW9uIiwiYXBpS2V5IiwicHJvY2VzcyIsImVudiIsIkdFTUlOSV9BUElfS0VZIiwidHJpbSIsInJlcGxhY2UiLCJFcnJvciIsImh0dHBPcHRpb25zIiwiaGVhZGVycyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/gemini.ts\n");

/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "./work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "?32c4":
/*!****************************!*\
  !*** bufferutil (ignored) ***!
  \****************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?66e9":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "next/dist/shared/lib/no-fallback-error.external":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/no-fallback-error.external" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/no-fallback-error.external");

/***/ }),

/***/ "next/dist/shared/lib/router/utils/app-paths":
/*!**************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/app-paths" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/app-paths");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/promises":
/*!***************************************!*\
  !*** external "node:stream/promises" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/promises");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@opentelemetry","vendor-chunks/google-auth-library","vendor-chunks/ws","vendor-chunks/gaxios","vendor-chunks/jws","vendor-chunks/retry","vendor-chunks/json-bigint","vendor-chunks/google-logging-utils","vendor-chunks/gcp-metadata","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/@google","vendor-chunks/safe-buffer","vendor-chunks/p-retry","vendor-chunks/jwa","vendor-chunks/extend","vendor-chunks/buffer-equal-constant-time","vendor-chunks/bignumber.js","vendor-chunks/base64-js"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-agent%2Fexplain%2Froute&page=%2Fapi%2Fmenu-agent%2Fexplain%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-agent%2Fexplain%2Froute.ts&appDir=%2Fapp%2Fapplet%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fapp%2Fapplet&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!")));
module.exports = __webpack_exports__;

})();