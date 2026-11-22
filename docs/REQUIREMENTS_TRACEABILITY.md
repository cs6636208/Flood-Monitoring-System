# Flood Monitoring System — Requirement Traceability

This document separates clickable prototype behavior from production integrations. The current project is a connected mock full stack, not an operational flood warning or rescue service.

| # | Requirement | Current prototype coverage | Needed before real operation |
|---:|---|---|---|
| 1 | No cost constraint | Architecture can use managed, highly available services | Select providers and capacity after operational design |
| 2 | No registration for public | Public reports and requests do not require an account | Abuse controls, rate limits, spam detection and privacy notice |
| 3 | Government data not mandatory | Demo uses synthetic data | Community, commercial, sensor or research data with quality and licensing checks |
| 4 | Route around flood water | Vehicle-specific route assessment is a mock API call | Routing provider, road closures, verified flood polygons and field confirmation |
| 5 | Nearby safe locations | Shelter, parking and assembly points are shown | Verified locations, hours, capacity, accessibility and status owner |
| 6 | Advance flood alerts | Sample 3–4 hour alert is displayed | Forecast source, threshold policy, geographic targeting and delivery provider |
| 7 | Drainage gate checks | Excluded by product decision | None unless scope changes |
| 8 | Real-time water level not essential | Current values are illustrative | Show source, capture time and uncertainty if later added |
| 9 | Dangerous animal rescue | Public help form includes dangerous animal case type | Dispatch agreement with qualified responders and safety protocol |
| 10 | Share help location | Form has consent field and editable sample location | Geolocation permission, precise-coordinate storage, access controls and retention policy |
| 11 | Predict 3–4 hours ahead | Mock forecast card/API | Calibrated model, observed inputs, confidence and validation by geography |
| 12 | Predict water flow/path | Risk route is illustrated | Hydrology model, terrain, rainfall and calibrated uncertainty ranges |
| 13 | UX/UI for all ages | Responsive layouts, readable labels and large actions | Accessibility audit, assistive-technology checks and user testing |
| 14 | Predictions may be uncertain | Demo warnings identify simulated/uncertain status | Confidence communication, false-alarm policy and human review |
| 15 | Share supply location and quantity | Supply request form captures location and quantity | Persistent request storage, deduplication and delivery workflow |
| 16 | LINE and SMS alerts | Demo says no messages are sent | LINE OA/SMS provider, consent, templates, retry and delivery monitoring |
| 17 | Vehicle-specific travelability | UI offers car, motorcycle, pickup, bus and boat assessments | Road/river network, vehicle constraints and verified closure data |
| 18 | Historical water levels | Not operational; values are not represented as measurements | Time-series storage, source metadata and chart/quality rules |
| 19 | Update rescue status | Team view updates cases through API | Durable database, audit trail, concurrent updates and role-based access |
| 20 | Flood guidance | General safety guidance is present | Review by qualified safety organizations and localization |
| 21 | Offline mode with last-update time | Explicitly excluded from this version | None unless scope changes |
| 22 | Report electrical leakage to authorities | Report form accepts electrical hazards but does not transmit them | Verified authority endpoint, escalation contacts and acknowledgment tracking |
| 23 | Track GPS for red cases | Consent control is illustrative only; no live tracking | Explicit consent lifecycle, responder app, secure streaming and retention limits |
| 24 | Availability | Local demo can be run with web and API together | Production deployment, redundancy, monitoring, backups and recovery objectives |
| 25 | Reservoir levels | Not connected to reservoir measurements | Licensed data source, timestamps, units, uncertainty and historical records |
| 26 | Alert staff when sensor fails | Sensor health examples are shown in team UI | Monitoring thresholds, alert channel, escalation and acknowledgment workflow |
| 27 | UX/UI for response teams | Team case list, filtering, status and sensor summary | Authentication, roles, audit, assignment workflow and operational usability tests |
| 28 | Photo-based flood/hazard report | File input is present but intentionally does not upload | Secure object storage, limits, malware scanning, privacy and moderation |
| 29 | Destination safety/accessibility | Sample route warning mentions endpoint verification | Destination status, capacity, road access and freshness checks before route display |

## Current implementation boundaries

- Frontend: React and TypeScript, with public and response-team views.
- Backend: Fastify JSON API; case creation, listing, status changes and route assessment use HTTP.
- Data: synthetic in-memory examples; restart resets changes.
- No production messaging, GPS tracking, image storage, live hydrology or emergency dispatch is active.

Treat a demo result as a user-interface example only. Never use it to choose a route or make emergency-response decisions.
