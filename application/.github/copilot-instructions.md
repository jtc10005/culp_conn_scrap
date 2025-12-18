# Copilot Instructions for Culpepper Genealogy Website

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js TypeScript genealogy website that displays an interactive family tree visualization for the Culpepper family. The project connects to a Neo4j graph database containing genealogy data.

## Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: Neo4j Graph Database (Aura cloud instance)
- **Styling**: Tailwind CSS
- **Visualization**: D3.js for interactive tree diagrams
- **API**: Next.js API routes for querying Neo4j

## Code Guidelines
- Use TypeScript strict mode
- Prefer server components over client components when possible
- Use the App Router (app/ directory) for routing
- API routes should be in app/api/ directory
- Keep Neo4j queries in separate utility functions
- Reuse the Person type from the scraper project
- Use Tailwind CSS for styling
- Add proper error handling for database queries
- Implement loading states for async data fetching

## Person Data Structure
The Person type includes:
- id, name, firstName, middleName, lastName
- gender, birth, birthPlace, death, deathPlace
- burial, burialPlace, marriageDate
- father, mother (parent IDs)
- spouses (array of IDs)
- children (array of IDs)

## Neo4j Relationships
- `[:SPOUSE]` - bidirectional relationship between spouses
- `[:PARENT_OF]` - directed relationship from parent to child
