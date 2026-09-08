import { Property, CustomFieldDefinition, ContactSubmission, ValuationRequest, MortgageInputs, MortgageBreakdown, AgentInfo } from '../types';

export const apiService = {
  // Agents Management
  async getAgents(): Promise<AgentInfo[]> {
    const res = await fetch('/api/agents');
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
  },

  async getAgentById(id: string): Promise<AgentInfo> {
    const res = await fetch(`/api/agents/${id}`);
    if (!res.ok) throw new Error('Agent not found');
    return res.json();
  },

  async createAgent(data: Partial<AgentInfo>): Promise<AgentInfo> {
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create agent');
    }
    return res.json();
  },

  async updateAgent(id: string, data: Partial<AgentInfo>): Promise<AgentInfo> {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update agent');
    }
    return res.json();
  },

  async deleteAgent(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete agent');
    }
    return res.json();
  },

  // Properties
  async getProperties(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    status?: string;
  }): Promise<Property[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params?.minBeds) query.append('minBeds', params.minBeds.toString());
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`/api/properties?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json();
  },

  async getPropertyById(id: string): Promise<Property> {
    const res = await fetch(`/api/properties/${id}`);
    if (!res.ok) throw new Error('Property not found');
    return res.json();
  },

  async createProperty(data: Partial<Property>): Promise<Property> {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create property');
    }
    return res.json();
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update property');
    }
    return res.json();
  },

  async deleteProperty(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete property');
    return res.json();
  },

  // Dynamic Custom Fields
  async getCustomFields(categoryId?: string): Promise<CustomFieldDefinition[]> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    const res = await fetch(`/api/custom-fields${query}`);
    if (!res.ok) throw new Error('Failed to fetch custom fields');
    return res.json();
  },

  async createCustomField(data: Partial<CustomFieldDefinition>): Promise<CustomFieldDefinition> {
    const res = await fetch('/api/custom-fields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create custom field');
    }
    return res.json();
  },

  async updateCustomField(id: string, data: Partial<CustomFieldDefinition>): Promise<CustomFieldDefinition> {
    const res = await fetch(`/api/custom-fields/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update custom field');
    return res.json();
  },

  async deleteCustomField(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/custom-fields/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete custom field');
    return res.json();
  },

  // Contact / Tour Inquiries
  async submitContact(data: Partial<ContactSubmission>): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit inquiry');
    }
    return res.json();
  },

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const res = await fetch('/api/contact');
    if (!res.ok) throw new Error('Failed to fetch contact inquiries');
    return res.json();
  },

  // Valuation Requests
  async submitValuation(data: Partial<ValuationRequest>): Promise<{ success: boolean; valuation: ValuationRequest; message: string }> {
    const res = await fetch('/api/valuation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit valuation');
    }
    return res.json();
  },

  async getValuationRequests(): Promise<ValuationRequest[]> {
    const res = await fetch('/api/valuation');
    if (!res.ok) throw new Error('Failed to fetch valuation requests');
    return res.json();
  },

  // Mortgage Calculator
  async calculateMortgage(inputs: MortgageInputs): Promise<MortgageBreakdown> {
    const res = await fetch('/api/mortgage-calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    });
    if (!res.ok) throw new Error('Failed to compute mortgage');
    return res.json();
  },
};
