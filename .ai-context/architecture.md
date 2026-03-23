# Architecture

System design, database schemas, and external integrations.

# System Design

The platform consists of several modules:

## User & Access Management Module

- SSO-based authentication
- Role-based access control (Writer/Approver)
- Secure session management
- User activity tracking

## SharePoint Integration & Knowledge Ingestion Module

- Connects to SharePoint repositories
- Extracts and indexes Word/PDF documents
- Content normalization and segmentation
- Semantic indexing

## External Data Integration Module

- API-based integration with approved external sources
- Data validation and normalization
- Unified search indexing

## Knowledge Retrieval & Semantic Search Module

- Natural language query processing
- Semantic similarity search
- Contextual content ranking

## AI Response Generation Module

- Context-based prompt construction
- Grounded response generation
- Consolidated answer formatting

## User Interaction & Offline Utilisation Module

- Chat-based response viewing
- Manual copy functionality
- Multi-query support

## Technology Stack (Adapted)

- Backend: TypeScript (Node.js)
- Frontend: React.js
- Database: VectorDB
- AI Model: LLM (GPT 5.0 or equivalent)
