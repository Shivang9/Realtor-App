import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Property, CustomFieldDefinition, ContactSubmission, ValuationRequest, MortgageInputs, MortgageBreakdown, AgentInfo } from './src/types';
import { INITIAL_PROPERTIES, INITIAL_CUSTOM_FIELDS, INITIAL_AGENTS } from './src/data/mockData';

// In-memory data store with initial seed data
let properties: Property[] = [...INITIAL_PROPERTIES];
let customFields: CustomFieldDefinition[] = [...INITIAL_CUSTOM_FIELDS];
let agents: AgentInfo[] = [...INITIAL_AGENTS];
let contactSubmissions: ContactSubmission[] = [
  {
    id: 'contact-init-1',
    propertyId: 'prop-200-cumberland',
    propertyTitle: '200 Cumberland St #3802',
    name: 'Julian Montgomery',
    email: 'j.montgomery@venturecap.com',
    phone: '+1 (416) 555-0199',
    inquiryType: 'Showing Request',
    preferredDate: '2026-09-08',
    message: 'Interested in booking a private sunset viewing of Penthouse 3802 for myself and my architect.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];
let valuationRequests: ValuationRequest[] = [
  {
    id: 'val-init-1',
    ownerName: 'Catherine Sterling',
    ownerEmail: 'c.sterling@investments.org',
    ownerPhone: '+1 (416) 555-0342',
    propertyAddress: '144 Prince Arthur Avenue, Annex',
    propertyType: 'residential',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4600,
    renovationsNotes: 'Completed full gut renovation with bespoke kitchen and wine cellar in 2024.',
    timeline: '1-3 months',
    estimatedValue: 7800000,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export function calculateMortgage(inputs: MortgageInputs): MortgageBreakdown {
  const homePrice = Number(inputs.homePrice) || 0;
  const downPayment = Number(inputs.downPayment) || 0;
  const loanAmount = Math.max(0, homePrice - downPayment);
  const annualRate = Number(inputs.interestRate) || 0;
  const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;
  const totalMonths = (Number(inputs.loanTermYears) || 30) * 12;

  let monthlyPI = 0;
  if (loanAmount > 0 && totalMonths > 0) {
    if (monthlyRate > 0) {
      monthlyPI = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPI = loanAmount / totalMonths;
    }
  }

  const monthlyTax = (Number(inputs.propertyTaxAnnual) || 0) / 12;
  const monthlyInsurance = (Number(inputs.homeInsuranceAnnual) || 0) / 12;
  const monthlyHoa = Number(inputs.hoaMonthly) || 0;
  const monthlyPmi = Number(inputs.pmiMonthly) || 0;
  const monthlyTotal = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPmi;

  const totalCostOfLoan = monthlyPI * totalMonths;
  const totalInterestPaid = Math.max(0, totalCostOfLoan - loanAmount);

  return {
    monthlyPrincipalInterest: Math.round(monthlyPI),
    monthlyPropertyTax: Math.round(monthlyTax),
    monthlyHomeInsurance: Math.round(monthlyInsurance),
    monthlyHoa: Math.round(monthlyHoa),
    monthlyPmi: Math.round(monthlyPmi),
    monthlyTotal: Math.round(monthlyTotal),
    totalLoanAmount: Math.round(loanAmount),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalCostOfLoan: Math.round(totalCostOfLoan + downPayment),
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ================= API ROUTES =================

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', propertiesCount: properties.length });
  });

  // --- PROPERTIES CRUD ---
  app.get('/api/properties', (req: Request, res: Response) => {
    const { category, search, minPrice, maxPrice, minBeds, status } = req.query;
    let filtered = [...properties];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    if (minBeds) {
      filtered = filtered.filter(p => p.bedrooms >= Number(minBeds));
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.street.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.get('/api/properties/:id', (req: Request, res: Response) => {
    const prop = properties.find(p => p.id === req.params.id);
    if (!prop) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(prop);
  });

  app.post('/api/properties', (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newProperty: Property = {
        id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title || 'Untitled Property',
        unitNumber: data.unitNumber || '',
        street: data.street || '',
        neighborhood: data.neighborhood || 'Central',
        city: data.city || 'Toronto',
        stateOrProvince: data.stateOrProvince || 'ON',
        postalCode: data.postalCode || '',
        price: Number(data.price) || 0,
        category: data.category || 'residential',
        status: data.status || 'For Sale',
        bedrooms: Number(data.bedrooms) || 0,
        extraBeds: Number(data.extraBeds) || 0,
        bathrooms: Number(data.bathrooms) || 0,
        sqft: Number(data.sqft) || 0,
        lotSize: data.lotSize || '',
        yearBuilt: Number(data.yearBuilt) || new Date().getFullYear(),
        description: data.description || '',
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
        ],
        coordinates: data.coordinates || { lat: 43.6708, lng: -79.3942 },
        features: Array.isArray(data.features) ? data.features : [],
        customFields: data.customFields || {},
        schools: Array.isArray(data.schools) ? data.schools : [],
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        taxAnnual: Number(data.taxAnnual) || 0,
        hoaFeesMonthly: Number(data.hoaFeesMonthly) || 0,
        agent: data.agent || {
          name: 'Victoria Stirling',
          title: 'Principal Broker',
          licenseNumber: 'REB-849204-ON',
          phone: '+1 (416) 902-8800',
          email: 'v.stirling@cumberlandrealty.com',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
          brokerage: 'Cumberland & Co. Luxury Real Estate',
        },
        featured: Boolean(data.featured),
        createdAt: new Date().toISOString(),
      };

      properties.unshift(newProperty);
      res.status(201).json(newProperty);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Failed to create property' });
    }
  });

  app.put('/api/properties/:id', (req: Request, res: Response) => {
    const index = properties.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const current = properties[index];
    const updated: Property = {
      ...current,
      ...req.body,
      id: current.id, // Immutable ID
      price: Number(req.body.price ?? current.price),
      bedrooms: Number(req.body.bedrooms ?? current.bedrooms),
      extraBeds: Number(req.body.extraBeds ?? current.extraBeds),
      bathrooms: Number(req.body.bathrooms ?? current.bathrooms),
      sqft: Number(req.body.sqft ?? current.sqft),
      customFields: {
        ...current.customFields,
        ...(req.body.customFields || {}),
      },
    };

    properties[index] = updated;
    res.json(updated);
  });

  app.delete('/api/properties/:id', (req: Request, res: Response) => {
    const initialLen = properties.length;
    properties = properties.filter(p => p.id !== req.params.id);
    if (properties.length === initialLen) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json({ success: true, message: 'Property deleted successfully' });
  });

  // --- DYNAMIC CUSTOM FIELDS SCHEMA API ---
  app.get('/api/custom-fields', (req: Request, res: Response) => {
    const { categoryId } = req.query;
    if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
      res.json(customFields.filter(f => f.categoryId === categoryId || f.categoryId === 'all'));
    } else {
      res.json(customFields);
    }
  });

  app.post('/api/custom-fields', (req: Request, res: Response) => {
    try {
      const data = req.body;
      if (!data.name || !data.label || !data.type) {
        res.status(400).json({ error: 'Name, label, and type are required' });
        return;
      }

      const id = data.id || `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newField: CustomFieldDefinition = {
        id,
        categoryId: data.categoryId || 'all',
        name: data.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        label: data.label,
        type: data.type,
        options: Array.isArray(data.options) ? data.options : undefined,
        placeholder: data.placeholder || '',
        unit: data.unit || '',
        required: Boolean(data.required),
        section: data.section || 'features',
      };

      customFields.push(newField);
      res.status(201).json(newField);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Failed to add custom field' });
    }
  });

  app.put('/api/custom-fields/:id', (req: Request, res: Response) => {
    const idx = customFields.findIndex(f => f.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Custom field not found' });
      return;
    }
    customFields[idx] = {
      ...customFields[idx],
      ...req.body,
      id: customFields[idx].id,
    };
    res.json(customFields[idx]);
  });

  app.delete('/api/custom-fields/:id', (req: Request, res: Response) => {
    const len = customFields.length;
    customFields = customFields.filter(f => f.id !== req.params.id);
    if (customFields.length === len) {
      res.status(404).json({ error: 'Field not found' });
      return;
    }
    res.json({ success: true, message: 'Custom field deleted' });
  });

  // --- AGENTS CRUD API ---
  app.get('/api/agents', (_req: Request, res: Response) => {
    res.json(agents);
  });

  app.get('/api/agents/:id', (req: Request, res: Response) => {
    const agent = agents.find(a => a.id === req.params.id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    res.json(agent);
  });

  app.post('/api/agents', (req: Request, res: Response) => {
    const { name, title, licenseNumber, phone, email, whatsapp, photo, brokerage, bio, specialties } = req.body;
    if (!name || !title || !email) {
      res.status(400).json({ error: 'Name, title, and email are required' });
      return;
    }

    const newAgent: AgentInfo = {
      id: `agent-${Date.now()}`,
      name,
      title,
      licenseNumber: licenseNumber || `REB-${Math.floor(100000 + Math.random() * 900000)}-ON`,
      phone: phone || '+1 (416) 902-8800',
      email,
      whatsapp: whatsapp || '',
      photo: photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      brokerage: brokerage || 'Shah & Co. Luxury Real Estate',
      bio: bio || '',
      specialties: Array.isArray(specialties) ? specialties : (typeof specialties === 'string' ? (specialties as string).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      active: true,
    };

    agents.push(newAgent);
    res.status(201).json(newAgent);
  });

  app.put('/api/agents/:id', (req: Request, res: Response) => {
    const idx = agents.findIndex(a => a.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const prevAgent = agents[idx];
    const updatedAgent: AgentInfo = {
      ...prevAgent,
      ...req.body,
      id: prevAgent.id,
    };
    agents[idx] = updatedAgent;

    // Synchronize properties represented by this agent
    properties = properties.map(p => {
      if (p.agent && (p.agent.id === req.params.id || p.agent.email === prevAgent.email)) {
        return {
          ...p,
          agent: {
            ...p.agent,
            ...updatedAgent,
          },
        };
      }
      return p;
    });

    res.json(updatedAgent);
  });

  app.delete('/api/agents/:id', (req: Request, res: Response) => {
    const agentToDelete = agents.find(a => a.id === req.params.id);
    if (!agentToDelete) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    agents = agents.filter(a => a.id !== req.params.id);
    res.json({ success: true, message: 'Agent removed successfully' });
  });

  // --- CONTACT / INQUIRY / TOUR SUBMISSIONS ---
  app.get('/api/contact', (_req: Request, res: Response) => {
    res.json(contactSubmissions);
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, phone, inquiryType, message, propertyId, propertyTitle, preferredDate } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      propertyId,
      propertyTitle,
      name,
      email,
      phone: phone || '',
      inquiryType: inquiryType || 'Property Inquiry',
      preferredDate,
      message,
      createdAt: new Date().toISOString(),
    };

    contactSubmissions.unshift(submission);
    res.status(201).json({ success: true, submission, message: 'Thank you. Our VIP real estate advisor will connect with you shortly.' });
  });

  // --- SELLER VALUATION REQUESTS ---
  app.get('/api/valuation', (_req: Request, res: Response) => {
    res.json(valuationRequests);
  });

  app.post('/api/valuation', (req: Request, res: Response) => {
    const { ownerName, ownerEmail, ownerPhone, propertyAddress, propertyType, bedrooms, bathrooms, sqft, renovationsNotes, timeline } = req.body;
    if (!ownerName || !ownerEmail || !propertyAddress) {
      res.status(400).json({ error: 'Owner name, email, and property address are required' });
      return;
    }

    // Estimate base market value
    const baseSqft = Number(sqft) || 2000;
    const ratePerSqft = propertyType === 'commercial' ? 1450 : propertyType === 'luxury_penthouse' ? 2800 : 1600;
    const estimatedValue = Math.round(baseSqft * ratePerSqft * (1 + (Number(bedrooms) || 2) * 0.05));

    const valuation: ValuationRequest = {
      id: `val-${Date.now()}`,
      ownerName,
      ownerEmail,
      ownerPhone: ownerPhone || '',
      propertyAddress,
      propertyType: propertyType || 'residential',
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      sqft: Number(sqft) || 0,
      renovationsNotes,
      timeline: timeline || '1-3 months',
      estimatedValue,
      createdAt: new Date().toISOString(),
    };

    valuationRequests.unshift(valuation);
    res.status(201).json({
      success: true,
      valuation,
      message: 'Your property evaluation dossier is being prepared by our Senior Valuation Partners.',
    });
  });

  // --- MORTGAGE CALCULATOR API ---
  app.post('/api/mortgage-calc', (req: Request, res: Response) => {
    const breakdown = calculateMortgage(req.body);
    res.json(breakdown);
  });

  // Serve root image assets directly
  app.get('/assets-advisor.png', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'assets-advisor.png'));
  });

  // ================= VITE MIDDLEWARE =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cumberland & Co. Real Estate server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
