// Challenge 2: What does it take to get approved?
//
// POST /api/approvals drafts the approvals checklist for a small multifamily
// project at the active site: the permits and reviews in order, who reviews
// each, a typical timeline and the documents usually needed. Every step says
// whether Gemini is sure; anything it is not sure of is shown as "confirm
// with the town".
import type { Express } from 'express';
import { askGeminiJson, siteLines, SiteContext } from './challengeApi';

export interface ApprovalStep {
  name: string;
  reviewer: string;
  whoToContact: string;
  typicalTimeline: string;
  documents: string[];
  sure: boolean;
}

const SCHEMA = {
  type: 'object',
  properties: {
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          reviewer: { type: 'string', description: 'Board or office that reviews it' },
          whoToContact: { type: 'string', description: 'Town office or role to call first' },
          typicalTimeline: { type: 'string' },
          documents: { type: 'array', items: { type: 'string' } },
          sure: {
            type: 'boolean',
            description: 'false unless this step is standard for this town',
          },
        },
        required: ['name', 'reviewer', 'whoToContact', 'typicalTimeline', 'documents', 'sure'],
      },
    },
  },
  required: ['steps'],
};

const SYSTEM = `You help Rhode Island housing practitioners plan local approvals for a small multifamily project (3 to 20 units).
List the permits and reviews in the order they usually happen, from a pre-application meeting to the building permit. Consider Rhode Island's Comprehensive Permit process (Low and Moderate Income Housing Act) where it could apply.
Name offices by role (planning department, zoning board of review, building official), not by person.
Set sure to false for anything that depends on this town's own rules. Never invent fees, phone numbers or names.`;

export function registerChallenge(app: Express) {
  app.post('/api/approvals', async (req, res) => {
    try {
      const site = req.body as SiteContext;
      if (!site?.address || !site?.town) {
        return res.status(400).json({ error: 'Explore a site first.' });
      }
      const result = await askGeminiJson<{ steps: ApprovalStep[] }>(
        SYSTEM,
        `${siteLines(site)}\n\nDraft the approvals checklist for a small multifamily project at this site.`,
        SCHEMA
      );
      res.json(result);
    } catch (err: any) {
      console.error('Approvals error:', err);
      res.status(500).json({ error: err.message || 'Could not draft the approvals checklist.' });
    }
  });
}
