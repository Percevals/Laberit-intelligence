import express from 'express';
import { CompanyRepository } from '../repositories/company.repository.js';
import { classifyBusinessModel } from '../services/classification.service.js';

const router = express.Router();
const companyRepo = new CompanyRepository();

// Get all companies with filters
router.get('/', async (req, res) => {
  try {
    const { search, businessModel, isProspect } = req.query;
    
    const filters = {
      search,
      businessModel,
      isProspect: isProspect === 'true' ? true : isProspect === 'false' ? false : undefined
    };

    const companies = await companyRepo.findAll(filters);
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get single company
router.get('/:id', async (req, res) => {
  try {
    const company = await companyRepo.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company
router.post('/', async (req, res) => {
  try {
    // Classify business model if not provided
    if (!req.body.dii_business_model) {
      const classification = classifyBusinessModel({
        companyName: req.body.name,
        industry: req.body.industry_traditional,
        description: req.body.description,
        employees: req.body.employees,
        revenue: req.body.revenue
      });

      req.body.dii_business_model = classification.model;
      req.body.confidence_score = classification.confidence / 100;
      req.body.classification_reasoning = classification.reasoning;
    }

    const company = await companyRepo.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const company = await companyRepo.update(req.params.id, req.body);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const company = await companyRepo.delete(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// Bulk import
router.post('/bulk', async (req, res) => {
  try {
    const { companies } = req.body;
    
    if (!Array.isArray(companies) || companies.length === 0) {
      return res.status(400).json({ error: 'Invalid companies array' });
    }

    // Classify each company
    const classifiedCompanies = companies.map(company => {
      if (!company.dii_business_model) {
        const classification = classifyBusinessModel({
          companyName: company.name,
          industry: company.industry_traditional,
          description: company.description,
          employees: company.employees,
          revenue: company.revenue
        });

        return {
          ...company,
          dii_business_model: classification.model,
          confidence_score: classification.confidence / 100,
          classification_reasoning: classification.reasoning
        };
      }
      return company;
    });

    const created = await companyRepo.bulkCreate(classifiedCompanies);
    res.status(201).json({
      success: created.length,
      companies: created
    });
  } catch (error) {
    console.error('Error bulk importing companies:', error);
    res.status(500).json({ error: 'Failed to import companies' });
  }
});

// Update verification
router.post('/:id/verify', async (req, res) => {
  try {
    const { source = 'manual' } = req.body;
    const company = await companyRepo.updateVerification(req.params.id, source);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Error updating verification:', error);
    res.status(500).json({ error: 'Failed to update verification' });
  }
});

// Get stale companies
router.get('/status/stale', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const companies = await companyRepo.getStaleCompanies(limit);
    res.json(companies);
  } catch (error) {
    console.error('Error fetching stale companies:', error);
    res.status(500).json({ error: 'Failed to fetch stale companies' });
  }
});

export default router;