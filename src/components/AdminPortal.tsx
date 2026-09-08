import React, { useState, useEffect } from 'react';
import { Property, CustomFieldDefinition, PropertyCategory, ContactSubmission, ValuationRequest, AgentInfo, AdminUser } from '../types';
import { formatCurrency, formatNumber, getCategoryLabel } from '../utils/formatters';
import { apiService } from '../services/apiService';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  SlidersHorizontal, 
  Layers, 
  Building2, 
  Home, 
  Mail, 
  FileSpreadsheet, 
  RefreshCw,
  Sparkles,
  MapPin,
  GraduationCap,
  Calendar,
  AlertCircle,
  Users,
  UserPlus,
  Phone,
  Briefcase,
  Award,
  Shield,
  UserCheck,
  MessageSquare,
  ExternalLink,
  Search,
  ArrowLeft,
  LogOut
} from 'lucide-react';

interface AdminPortalProps {
  properties: Property[];
  customFields: CustomFieldDefinition[];
  agents?: AgentInfo[];
  initialTab?: 'properties' | 'agents' | 'fields' | 'leads';
  onRefreshData: () => void;
  onExitToPublic?: () => void;
  onLogout?: () => void;
  adminUser?: AdminUser | null;
}

const AGENT_AVATAR_PRESETS = [
  { label: 'Victoria', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Alexander', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Marcus', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Elena', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
  { label: 'Claire', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  { label: 'Julian', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  properties,
  customFields,
  agents = [],
  initialTab = 'properties',
  onRefreshData,
  onExitToPublic,
  onLogout,
  adminUser
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'agents' | 'fields' | 'leads'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Agents State
  const [agentsList, setAgentsList] = useState<AgentInfo[]>(agents);
  const [searchAgentQuery, setSearchAgentQuery] = useState('');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState<Partial<AgentInfo> & { specialtiesString?: string }>({
    name: '',
    title: 'Senior Partner, Luxury Portfolio',
    licenseNumber: 'REB-849204-ON',
    phone: '+1 (416) 902-8800',
    email: '',
    whatsapp: '+14169028800',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    brokerage: 'Shah & Co. Luxury Real Estate',
    bio: '',
    specialtiesString: 'Luxury Penthouses, Yorkville',
    active: true,
  });

  // Property Form State (Add / Edit)
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState<Partial<Property>>({
    title: '',
    unitNumber: '',
    street: '',
    neighborhood: 'Annex',
    city: 'Toronto',
    stateOrProvince: 'ON',
    postalCode: 'M5R 1A6',
    price: 5000000,
    category: 'residential',
    status: 'For Sale',
    bedrooms: 3,
    extraBeds: 0,
    bathrooms: 3,
    sqft: 2500,
    lotSize: '',
    yearBuilt: 2022,
    description: '',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'],
    coordinates: { lat: 43.6708, lng: -79.3942 },
    features: ['Valet Underground Parking', '24/7 Concierge'],
    customFields: {},
    schools: [],
    amenities: [],
    taxAnnual: 18000,
    hoaFeesMonthly: 1200,
    featured: false,
  });

  // Custom Field Form State (Add / Edit)
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState<Partial<CustomFieldDefinition>>({
    categoryId: 'residential',
    name: '',
    label: '',
    type: 'text',
    unit: '',
    placeholder: '',
    options: [],
    required: false,
    section: 'features',
  });
  const [optionsString, setOptionsString] = useState('');

  // Leads state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [valuations, setValuations] = useState<ValuationRequest[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Sync agents from prop
  useEffect(() => {
    if (agents && agents.length > 0) {
      setAgentsList(agents);
    }
  }, [agents]);

  // Load agents or leads when clicking tabs
  useEffect(() => {
    if (activeTab === 'agents') {
      apiService.getAgents()
        .then((data) => {
          if (Array.isArray(data)) setAgentsList(data);
        })
        .catch((err) => console.error('Failed to load agents:', err));
    } else if (activeTab === 'leads') {
      setIsLoadingLeads(true);
      Promise.all([apiService.getContactSubmissions(), apiService.getValuationRequests()])
        .then(([contactData, valData]) => {
          setContacts(contactData);
          setValuations(valData);
          setIsLoadingLeads(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoadingLeads(false);
        });
    }
  }, [activeTab]);

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // --- PROPERTY HANDLERS ---
  const handleOpenAddProperty = () => {
    setEditingPropertyId(null);
    setPropForm({
      title: '',
      unitNumber: '',
      street: '',
      neighborhood: 'Annex',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalCode: 'M5R 1A6',
      price: 6500000,
      category: 'residential',
      status: 'For Sale',
      bedrooms: 3,
      extraBeds: 0,
      bathrooms: 3.5,
      sqft: 2800,
      yearBuilt: 2023,
      description: 'Sophisticated luxury residence featuring bespoke architectural detailing, high ceilings, and curated imported finishes.',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      ],
      coordinates: { lat: 43.6708, lng: -79.3942 },
      features: ['White-Glove 24/7 Concierge', 'Valet Parking', 'Custom European Millwork'],
      customFields: {},
      schools: [
        { name: 'The York School', type: 'Private', grades: 'JK-12', rating: 9.8, distance: '0.5 km', walkTime: '6 min walk' }
      ],
      amenities: [
        { name: 'Bay & Bloor Station', category: 'Transit', distance: '0.3 km', walkTime: '4 min walk' },
        { name: 'Four Seasons Spa & Dining', category: 'Dining', distance: '0.4 km', walkTime: '5 min walk' }
      ],
      taxAnnual: 18500,
      hoaFeesMonthly: 1500,
      featured: false,
      agent: agentsList.length > 0 ? agentsList[0] : undefined,
    });
    setIsPropertyModalOpen(true);
  };

  const handleOpenEditProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropForm({ 
      ...prop,
      agent: prop.agent || (agentsList.length > 0 ? agentsList[0] : undefined)
    });
    setIsPropertyModalOpen(true);
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await apiService.deleteProperty(id);
      showNotification(`Property "${title}" deleted successfully.`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete property');
    }
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.street || !propForm.price) {
      alert('Street address and price are required.');
      return;
    }

    try {
      const fullTitle = `${propForm.street} ${propForm.unitNumber ? `#${propForm.unitNumber}` : ''}`.trim();
      const payload: Partial<Property> = {
        ...propForm,
        title: fullTitle,
        price: Number(propForm.price),
        bedrooms: Number(propForm.bedrooms) || 0,
        extraBeds: Number(propForm.extraBeds) || 0,
        bathrooms: Number(propForm.bathrooms) || 0,
        sqft: Number(propForm.sqft) || 0,
        taxAnnual: Number(propForm.taxAnnual) || 0,
        hoaFeesMonthly: Number(propForm.hoaFeesMonthly) || 0,
      };

      if (editingPropertyId) {
        await apiService.updateProperty(editingPropertyId, payload);
        showNotification(`Property "${fullTitle}" updated successfully.`);
      } else {
        await apiService.createProperty(payload);
        showNotification(`New listing "${fullTitle}" published successfully.`);
      }

      setIsPropertyModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save property');
    }
  };

  // --- DYNAMIC CUSTOM FIELD HANDLERS ---
  const handleOpenAddField = () => {
    setEditingFieldId(null);
    setFieldForm({
      categoryId: 'residential',
      name: '',
      label: '',
      type: 'text',
      unit: '',
      placeholder: '',
      options: [],
      required: false,
      section: 'features',
    });
    setOptionsString('');
    setIsFieldModalOpen(true);
  };

  const handleOpenEditField = (field: CustomFieldDefinition) => {
    setEditingFieldId(field.id);
    setFieldForm({ ...field });
    setOptionsString(field.options ? field.options.join(', ') : '');
    setIsFieldModalOpen(true);
  };

  const handleDeleteField = async (id: string, label: string) => {
    if (!confirm(`Delete custom field definition "${label}"? Existing property values will be preserved.`)) return;
    try {
      await apiService.deleteCustomField(id);
      showNotification(`Custom field "${label}" removed.`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete custom field');
    }
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldForm.label || !fieldForm.type) {
      alert('Label and type are required.');
      return;
    }

    try {
      const generatedName = (fieldForm.name || fieldForm.label)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

      const parsedOptions = optionsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Partial<CustomFieldDefinition> = {
        ...fieldForm,
        name: generatedName,
        options: parsedOptions.length > 0 ? parsedOptions : undefined,
      };

      if (editingFieldId) {
        await apiService.updateCustomField(editingFieldId, payload);
        showNotification(`Custom field "${fieldForm.label}" updated.`);
      } else {
        await apiService.createCustomField(payload);
        showNotification(`New dynamic field "${fieldForm.label}" configured.`);
      }

      setIsFieldModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save custom field');
    }
  };

  // --- AGENT HANDLERS ---
  const handleOpenAddAgent = () => {
    setEditingAgentId(null);
    setAgentForm({
      name: '',
      title: 'Senior Partner, Luxury Portfolio',
      licenseNumber: `REB-${Math.floor(100000 + Math.random() * 900000)}-ON`,
      phone: '+1 (416) 902-8800',
      email: '',
      whatsapp: '+14169028800',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      brokerage: 'Shah & Co. Luxury Real Estate',
      bio: 'Advising discerning private clientele with bespoke white-glove acquisition and portfolio management services across Toronto and international luxury enclaves.',
      specialties: ['Luxury Penthouses', 'Yorkville Estates'],
      specialtiesString: 'Luxury Penthouses, Yorkville Estates, Off-Market Acquisitions',
      active: true,
    });
    setIsAgentModalOpen(true);
  };

  const handleOpenEditAgent = (agent: AgentInfo) => {
    setEditingAgentId(agent.id || null);
    setAgentForm({
      ...agent,
      specialtiesString: agent.specialties?.join(', ') || '',
    });
    setIsAgentModalOpen(true);
  };

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    const assignedProps = properties.filter(
      (p) => p.agent?.id === agentId || p.agent?.name === agentName || p.agent?.email === agentsList.find(a => a.id === agentId)?.email
    );
    const msg = assignedProps.length > 0
      ? `Advisor "${agentName}" currently represents ${assignedProps.length} property listing(s). Removing this advisor will update the roster. Do you wish to continue?`
      : `Are you sure you want to remove advisor "${agentName}" from the Shah & Co. advisory team?`;

    if (!confirm(msg)) return;

    try {
      await apiService.deleteAgent(agentId);
      showNotification(`Advisor "${agentName}" removed from team.`);
      setAgentsList((prev) => prev.filter((a) => a.id !== agentId));
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete agent');
    }
  };

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name || !agentForm.email) {
      alert('Agent name and email are required.');
      return;
    }

    try {
      const parsedSpecialties = agentForm.specialtiesString
        ? agentForm.specialtiesString.split(',').map((s) => s.trim()).filter(Boolean)
        : (agentForm.specialties || []);

      const payload: Partial<AgentInfo> = {
        name: agentForm.name,
        title: agentForm.title || 'Senior Partner, Luxury Portfolio',
        licenseNumber: agentForm.licenseNumber || `REB-${Math.floor(100000 + Math.random() * 900000)}-ON`,
        phone: agentForm.phone || '+1 (416) 902-8800',
        email: agentForm.email,
        whatsapp: agentForm.whatsapp || '',
        photo: agentForm.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        brokerage: agentForm.brokerage || 'Shah & Co. Luxury Real Estate',
        bio: agentForm.bio || '',
        specialties: parsedSpecialties,
        active: true,
      };

      if (editingAgentId) {
        const updated = await apiService.updateAgent(editingAgentId, payload);
        showNotification(`Advisor "${agentForm.name}" updated successfully.`);
        setAgentsList((prev) => prev.map((a) => (a.id === editingAgentId ? updated : a)));
      } else {
        const created = await apiService.createAgent(payload);
        showNotification(`New advisor "${agentForm.name}" registered successfully.`);
        setAgentsList((prev) => [...prev, created]);
      }

      setIsAgentModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save agent profile');
    }
  };

  const filteredAgents = agentsList.filter((agent) => {
    if (!searchAgentQuery.trim()) return true;
    const q = searchAgentQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(q) ||
      agent.title.toLowerCase().includes(q) ||
      (agent.licenseNumber && agent.licenseNumber.toLowerCase().includes(q)) ||
      (agent.brokerage && agent.brokerage.toLowerCase().includes(q)) ||
      (agent.specialties && agent.specialties.some((s) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#1D2421]">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#EAEFE8] text-[#273B30] border border-[#D5DDD2] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D5C4B]" />
              <span>Administrative Console</span>
            </span>
            <span className="text-xs text-stone-500">Brokerage Operations & Team Hub</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1D2421] mt-2">
            Brokerage, Agents & Dynamic Schema Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Global Action feedback toast */}
          {actionFeedback && (
            <div className="bg-[#EAEFE8] border border-[#D5DDD2] text-[#273B30] text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-2 animate-in fade-in duration-200 shadow-xs">
              <Check className="w-4 h-4 text-[#273B30]" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {adminUser && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">{adminUser.name}</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">({adminUser.role.replace('_', ' ')})</span>
            </div>
          )}

          {onExitToPublic && (
            <button
              onClick={onExitToPublic}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-950 text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Return to public customer view"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Public Site</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600 text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex items-center space-x-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'properties'
              ? 'border-[#D95D39] text-[#D95D39] bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('agents')}
          className={`flex items-center space-x-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'agents'
              ? 'border-[#D95D39] text-[#D95D39] bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Advisory Agents ({agentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fields')}
          className={`flex items-center space-x-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'fields'
              ? 'border-[#D95D39] text-[#D95D39] bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Dynamic Custom Fields ({customFields.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center space-x-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'leads'
              ? 'border-[#D95D39] text-[#D95D39] bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Client Inquiries & Valuations</span>
        </button>
      </div>

      {/* TAB 1: PROPERTIES MANAGER */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-serif-luxury text-[#1D2421]">Active Property Listings</h2>
              <p className="text-xs text-stone-600">Create, update, or remove residential and commercial real estate records.</p>
            </div>
            <button
              onClick={handleOpenAddProperty}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Property</span>
            </button>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#F8F9F5] text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Listing / Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Specs</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-[#F8F9F5]/70 transition">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#1D2421]">{prop.street} {prop.unitNumber ? `#${prop.unitNumber}` : ''}</div>
                          <div className="text-[11px] text-stone-500">{prop.neighborhood}, {prop.city}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 border border-stone-200 text-stone-700 font-medium px-2 py-0.5 rounded-md capitalize">
                          {prop.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1D2421]">
                        {formatCurrency(prop.price)}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {prop.sqft} sq ft • {prop.bedrooms > 0 ? `${prop.bedrooms} bed` : 'Commercial'} • {prop.bathrooms} bath
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-[#FAF6F4] text-[#D95D39] border border-[#F0D5CC] font-semibold px-2 py-0.5 rounded-md text-[11px]">
                          {prop.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditProperty(prop)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#1D2421] hover:bg-stone-100 transition cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id, prop.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AGENTS / ADVISORY TEAM MANAGER */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#1D2421] flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#D95D39]" />
                <span className="font-serif-luxury text-xl">Brokerage Advisory Team & Licensed Agents</span>
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Manage luxury real estate partners, credentials, contact channels, and assigned property representations for Shah & Co.
              </p>
            </div>
            <button
              onClick={handleOpenAddAgent}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Agent</span>
            </button>
          </div>

          {/* Search bar & statistics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center bg-white border border-stone-200 rounded-xl px-4 py-2.5 max-w-md w-full shadow-xs">
              <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search advisors by name, title, or specialty..."
                value={searchAgentQuery}
                onChange={(e) => setSearchAgentQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#1D2421] placeholder-stone-400 focus:outline-none"
              />
              {searchAgentQuery && (
                <button onClick={() => setSearchAgentQuery('')} className="text-stone-400 hover:text-stone-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-stone-500 flex items-center space-x-3">
              <span>Showing <strong className="text-[#1D2421]">{filteredAgents.length}</strong> of {agentsList.length} advisors</span>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => {
              const assignedListings = properties.filter(
                (p) => p.agent?.id === agent.id || p.agent?.name === agent.name || p.agent?.email === agent.email
              );

              return (
                <div
                  key={agent.id || agent.email}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-stone-300 hover:shadow-sm transition"
                >
                  <div className="p-6 space-y-4">
                    {/* Header: Photo, Name, Badge */}
                    <div className="flex items-start space-x-4">
                      <div className="relative shrink-0">
                        <img
                          src={agent.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'}
                          alt={agent.name}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active License" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif-luxury text-base font-bold text-[#1D2421] truncate">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-[#D95D39] font-semibold truncate">{agent.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] bg-[#F8F9F5] text-stone-600 px-2 py-0.5 rounded-md border border-stone-200 font-mono">
                            {agent.licenseNumber || 'REB-ON'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Brokerage & Bio */}
                    <div className="text-xs text-stone-600 space-y-1">
                      <div className="flex items-center space-x-1 text-[#1D2421] font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{agent.brokerage || 'Shah & Co. Luxury Real Estate'}</span>
                      </div>
                      {agent.bio && (
                        <p className="text-xs text-stone-600 line-clamp-2 italic pt-1">
                          "{agent.bio}"
                        </p>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="bg-[#F8F9F5] p-3 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-stone-700">
                        <span className="text-stone-500 flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-[#D95D39] shrink-0" />
                          <span>Phone:</span>
                        </span>
                        <a href={`tel:${agent.phone}`} className="hover:text-[#D95D39] font-mono text-[11px] transition">
                          {agent.phone || '+1 (416) 902-8800'}
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-stone-700">
                        <span className="text-stone-500 flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-[#273B30] shrink-0" />
                          <span>Email:</span>
                        </span>
                        <a href={`mailto:${agent.email}`} className="hover:text-[#D95D39] font-mono text-[11px] truncate max-w-[160px] transition">
                          {agent.email}
                        </a>
                      </div>
                      {agent.whatsapp && (
                        <div className="flex items-center justify-between text-stone-700">
                          <span className="text-stone-500 flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>WhatsApp:</span>
                          </span>
                          <a
                            href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 font-mono text-[11px] transition"
                          >
                            {agent.whatsapp}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Specialties */}
                    {agent.specialties && agent.specialties.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Expertise & Specialties</div>
                        <div className="flex flex-wrap gap-1.5">
                          {agent.specialties.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] bg-[#EAEFE8] text-[#273B30] px-2 py-0.5 rounded-md border border-[#D5DDD2]"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assigned Properties Summary */}
                    <div className="border-t border-stone-100 pt-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                        <span>Assigned Listings ({assignedListings.length})</span>
                        <span className="text-[11px] text-[#D95D39] font-mono font-bold">
                          {assignedListings.length > 0 ? `${assignedListings.length} Active` : 'Unassigned'}
                        </span>
                      </div>
                      {assignedListings.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {assignedListings.slice(0, 2).map((p) => (
                            <div key={p.id} className="text-[11px] text-stone-600 truncate flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D95D39] shrink-0" />
                              <span className="truncate">{p.title}</span>
                            </div>
                          ))}
                          {assignedListings.length > 2 && (
                            <div className="text-[10px] text-stone-500 italic">
                              + {assignedListings.length - 2} more property representations
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-6 py-3 bg-[#F8F9F5] border-t border-stone-200/80 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditAgent(agent)}
                      className="flex items-center space-x-1.5 text-xs text-stone-700 hover:text-[#D95D39] transition font-semibold cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id!, agent.name)}
                      className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 transition font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAgents.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3 shadow-xs">
              <Users className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-base font-bold text-[#1D2421]">No advisors match your search</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try searching for another name or register a new advisor to the Shah & Co. roster.
              </p>
              <button
                onClick={handleOpenAddAgent}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Advisor</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DYNAMIC CUSTOM FIELDS MANAGER */}
      {activeTab === 'fields' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
            <div>
              <h2 className="text-xl font-bold font-serif-luxury text-[#1D2421] flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#D95D39]" />
                <span>Dynamic Category Field Engine</span>
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Configure tailored fields for <strong className="text-stone-900">Residential</strong> (e.g. HOA, Locker, Parking) or <strong className="text-stone-900">Commercial</strong> (e.g. Zoning, Cap Rate, Docks, Ceiling Height).
              </p>
            </div>
            <button
              onClick={handleOpenAddField}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Field</span>
            </button>
          </div>

          {/* Fields by Category List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customFields.map((field) => (
              <div key={field.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF6F4] text-[#D95D39] border border-[#F0D5CC]">
                      {field.categoryId}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                      Type: {field.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1D2421] mt-2.5">{field.label}</h3>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">ID: {field.name}</div>
                  
                  {field.unit && (
                    <div className="text-xs text-stone-600 mt-1">
                      Unit: <span className="font-semibold text-[#1D2421]">{field.unit}</span>
                    </div>
                  )}

                  {field.options && field.options.length > 0 && (
                    <div className="text-[11px] text-stone-600 mt-2 bg-[#F8F9F5] p-2.5 rounded-xl border border-stone-200">
                      Options: {field.options.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <span className="text-stone-500">Section: {field.section || 'features'}</span>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleOpenEditField(field)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#1D2421] hover:bg-stone-100 transition cursor-pointer"
                      title="Edit Field"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.id, field.label)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEADS & INQUIRIES */}
      {activeTab === 'leads' && (
        <div className="space-y-8">
          {isLoadingLeads ? (
            <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">Loading incoming leads...</div>
          ) : (
            <>
              {/* Tour and Showing Inquiries */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold font-serif-luxury text-[#1D2421] flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-[#D95D39]" />
                  <span>Private Tour & Client Inquiries ({contacts.length})</span>
                </h3>

                {contacts.length === 0 ? (
                  <p className="text-xs text-stone-500">No client tour requests submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {contacts.map((c) => (
                      <div key={c.id} className="p-4 bg-[#F8F9F5] rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="font-bold text-[#1D2421] text-sm">{c.name} ({c.email})</div>
                          <span className="text-xs bg-[#FAF6F4] text-[#D95D39] border border-[#F0D5CC] font-semibold px-2 py-0.5 rounded-md">
                            {c.inquiryType}
                          </span>
                        </div>
                        {c.propertyTitle && (
                          <div className="text-xs font-semibold text-stone-700">Property: {c.propertyTitle}</div>
                        )}
                        <p className="text-xs text-stone-600 italic">"{c.message}"</p>
                        <div className="text-[11px] text-stone-500 flex justify-between">
                          <span>Phone: {c.phone || 'Not provided'}</span>
                          <span>Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seller Valuation Leads */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold font-serif-luxury text-[#1D2421] flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#273B30]" />
                  <span>Seller Valuation Dossier Requests ({valuations.length})</span>
                </h3>

                {valuations.length === 0 ? (
                  <p className="text-xs text-stone-500">No valuation requests logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {valuations.map((v) => (
                      <div key={v.id} className="p-4 bg-[#F8F9F5] rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-[#1D2421] text-sm">{v.ownerName} - {v.propertyAddress}</div>
                          <span className="text-xs bg-[#EAEFE8] text-[#273B30] border border-[#D5DDD2] font-bold px-2 py-0.5 rounded-md">
                            Est. {formatCurrency(v.estimatedValue || 0)}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600">
                          {v.propertyType} • {v.sqft} sq ft • {v.bedrooms} beds • {v.bathrooms} baths
                        </div>
                        {v.renovationsNotes && (
                          <div className="text-xs text-stone-600">Notes: {v.renovationsNotes}</div>
                        )}
                        <div className="text-[11px] text-stone-500 flex justify-between">
                          <span>Email: {v.ownerEmail} • Phone: {v.ownerPhone}</span>
                          <span>Timeline: {v.timeline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT PROPERTY */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-[#F8F9F5] sticky top-0 z-10">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1D2421]">
                {editingPropertyId ? 'Edit Property Listing' : 'Publish New Luxury Property'}
              </h3>
              <button onClick={() => setIsPropertyModalOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-[#1D2421] transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              
              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700">Property Category *</label>
                  <select
                    value={propForm.category}
                    onChange={(e) => setPropForm({ ...propForm, category: e.target.value as PropertyCategory })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  >
                    <option value="residential">Residential Estate</option>
                    <option value="luxury_penthouse">Luxury Penthouse</option>
                    <option value="commercial">Commercial Real Estate</option>
                    <option value="land">Land & Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">Listing Status</label>
                  <select
                    value={propForm.status}
                    onChange={(e) => setPropForm({ ...propForm, status: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="Under Contract">Under Contract</option>
                    <option value="Sold">Sold</option>
                    <option value="For Lease">For Lease</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">List Price (CAD) *</label>
                  <input
                    type="number"
                    required
                    value={propForm.price}
                    onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] font-bold"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={propForm.street}
                    onChange={(e) => setPropForm({ ...propForm, street: e.target.value })}
                    placeholder="e.g. 200 Cumberland St"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Unit # (Optional)</label>
                  <input
                    type="text"
                    value={propForm.unitNumber}
                    onChange={(e) => setPropForm({ ...propForm, unitNumber: e.target.value })}
                    placeholder="e.g. 3802"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Neighborhood</label>
                  <input
                    type="text"
                    value={propForm.neighborhood}
                    onChange={(e) => setPropForm({ ...propForm, neighborhood: e.target.value })}
                    placeholder="e.g. Annex / Yorkville"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">Interior Sq Ft *</label>
                  <input
                    type="number"
                    value={propForm.sqft}
                    onChange={(e) => setPropForm({ ...propForm, sqft: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Bedrooms</label>
                  <input
                    type="number"
                    value={propForm.bedrooms}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Extra Beds (Den)</label>
                  <input
                    type="number"
                    value={propForm.extraBeds}
                    onChange={(e) => setPropForm({ ...propForm, extraBeds: Number(e.target.value) })}
                    placeholder="e.g. 1"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    value={propForm.bathrooms}
                    onChange={(e) => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
              </div>

              {/* DYNAMIC CUSTOM FIELDS FOR THE CHOSEN CATEGORY */}
              <div className="bg-[#F8F9F5] p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-[#1D2421] uppercase tracking-wider flex items-center space-x-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Dynamic Category Fields ({propForm.category?.replace('_', ' ')})</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">Auto-populated schema</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {customFields
                    .filter((f) => f.categoryId === propForm.category || f.categoryId === 'all')
                    .map((field) => {
                      const currentVal = propForm.customFields?.[field.id] ?? propForm.customFields?.[field.name] ?? '';

                      return (
                        <div key={field.id} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                          <label className="text-xs font-semibold text-stone-700">{field.label}</label>
                          {field.type === 'select' ? (
                            <select
                              value={currentVal as string}
                              onChange={(e) =>
                                setPropForm({
                                  ...propForm,
                                  customFields: { ...propForm.customFields, [field.id]: e.target.value },
                                })
                              }
                              className="w-full text-xs p-1.5 rounded-lg border border-stone-200 bg-[#F8F9F5] text-[#1D2421]"
                            >
                              <option value="">-- Select --</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'boolean' ? (
                            <div className="flex items-center space-x-2 pt-1">
                              <input
                                type="checkbox"
                                checked={Boolean(currentVal)}
                                onChange={(e) =>
                                  setPropForm({
                                    ...propForm,
                                    customFields: { ...propForm.customFields, [field.id]: e.target.checked },
                                  })
                                }
                                className="rounded text-[#D95D39] focus:ring-[#D95D39]"
                              />
                              <span className="text-xs text-stone-700">Included / Yes</span>
                            </div>
                          ) : (
                            <input
                              type={field.type === 'number' || field.type === 'currency' ? 'number' : 'text'}
                              value={currentVal as string | number}
                              placeholder={field.placeholder || ''}
                              onChange={(e) =>
                                setPropForm({
                                  ...propForm,
                                  customFields: { ...propForm.customFields, [field.id]: e.target.value },
                                })
                              }
                              className="w-full text-xs p-1.5 rounded-lg border border-stone-200 bg-[#F8F9F5] text-[#1D2421]"
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Representing Advisory Agent */}
              <div className="bg-[#F8F9F5] p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1D2421] flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#D95D39]" />
                    <span>Representing Advisory Agent / Partner</span>
                  </label>
                  <span className="text-[11px] text-stone-500">Assigned listing agent</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-600">Select Registered Agent</label>
                    <select
                      value={propForm.agent?.id || ''}
                      onChange={(e) => {
                        const selected = agentsList.find(a => a.id === e.target.value);
                        if (selected) {
                          setPropForm({ ...propForm, agent: selected });
                        }
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] mt-1"
                    >
                      <option value="">-- Choose Agent from Roster --</option>
                      {agentsList.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  {propForm.agent && (
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-stone-200">
                      <img
                        src={propForm.agent.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'}
                        alt={propForm.agent.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#1D2421] truncate">{propForm.agent.name}</div>
                        <div className="text-[10px] text-[#D95D39] font-medium truncate">{propForm.agent.title}</div>
                        <div className="text-[10px] text-stone-500 font-mono truncate">{propForm.agent.phone || propForm.agent.email}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-stone-700">Property Description</label>
                <textarea
                  rows={3}
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold text-stone-700">Primary Image URL</label>
                <input
                  type="text"
                  value={propForm.images?.[0] || ''}
                  onChange={(e) => setPropForm({ ...propForm, images: [e.target.value, ...(propForm.images?.slice(1) || [])] })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
                >
                  {editingPropertyId ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DYNAMIC CUSTOM FIELD */}
      {isFieldModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-[#F8F9F5]">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">
                {editingFieldId ? 'Modify Dynamic Field' : 'Define New Dynamic Field'}
              </h3>
              <button onClick={() => setIsFieldModalOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-[#1D2421] transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700">Applies to Category *</label>
                <select
                  value={fieldForm.categoryId}
                  onChange={(e) => setFieldForm({ ...fieldForm, categoryId: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="luxury_penthouse">Luxury Penthouse</option>
                  <option value="land">Land & Development</option>
                  <option value="all">All Categories</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Field Display Label *</label>
                <input
                  type="text"
                  required
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                  placeholder="e.g. Projected Cap Rate, HOA Dues, Ceiling Height"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">Data Type *</label>
                  <select
                    value={fieldForm.type}
                    onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="currency">Currency ($)</option>
                    <option value="select">Select Dropdown</option>
                    <option value="boolean">Yes / No (Boolean)</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">Unit / Suffix</label>
                  <input
                    type="text"
                    value={fieldForm.unit || ''}
                    onChange={(e) => setFieldForm({ ...fieldForm, unit: e.target.value })}
                    placeholder="e.g. %, sq ft, ft, /mo"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
              </div>

              {fieldForm.type === 'select' && (
                <div>
                  <label className="text-xs font-bold text-stone-700">Options (Comma separated)</label>
                  <input
                    type="text"
                    value={optionsString}
                    onChange={(e) => setOptionsString(e.target.value)}
                    placeholder="e.g. Triple Net, Gross Lease, Modified Gross"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Save Field Definition
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ADVISORY AGENT */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border border-stone-200 my-8">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-[#F8F9F5]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAEFE8] border border-[#D5DDD2] flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#273B30]" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">
                  {editingAgentId ? 'Edit Advisory Agent Profile' : 'Register New Advisory Agent'}
                </h3>
              </div>
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgent} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Full Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={agentForm.name || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                    placeholder="e.g. Alistair Shah, Victoria Chen"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Professional Title</label>
                  <input
                    type="text"
                    value={agentForm.title || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, title: e.target.value })}
                    placeholder="e.g. Senior Partner, Luxury Portfolio"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
              </div>

              {/* License Number & Brokerage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700">License / RECO Registration #</label>
                  <input
                    type="text"
                    value={agentForm.licenseNumber || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, licenseNumber: e.target.value })}
                    placeholder="e.g. REB-849201-ON"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Brokerage Affiliation</label>
                  <input
                    type="text"
                    value={agentForm.brokerage || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, brokerage: e.target.value })}
                    placeholder="Shah & Co. Luxury Real Estate"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={agentForm.email || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                    placeholder="agent@shahandco.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Direct Phone</label>
                  <input
                    type="text"
                    value={agentForm.phone || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    placeholder="+1 (416) 902-8800"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">WhatsApp Number</label>
                  <input
                    type="text"
                    value={agentForm.whatsapp || ''}
                    onChange={(e) => setAgentForm({ ...agentForm, whatsapp: e.target.value })}
                    placeholder="+14169028800"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                  />
                </div>
              </div>

              {/* Photo Selector with Previews */}
              <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Advisor Headshot & Profile Image</label>
                  <span className="text-[11px] text-stone-500">Select preset or paste URL</span>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={agentForm.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#D95D39] shrink-0 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={agentForm.photo || ''}
                      onChange={(e) => setAgentForm({ ...agentForm, photo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white text-[#1D2421]"
                    />
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="text-stone-500 self-center">Presets:</span>
                      {[
                        { label: 'Executive 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
                        { label: 'Executive 2', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
                        { label: 'Executive 3', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
                        { label: 'Executive 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80' },
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setAgentForm({ ...agentForm, photo: preset.url })}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="text-xs font-bold text-stone-700">Areas of Expertise & Specialties (Comma separated)</label>
                <input
                  type="text"
                  value={agentForm.specialtiesString || ''}
                  onChange={(e) => setAgentForm({ ...agentForm, specialtiesString: e.target.value })}
                  placeholder="e.g. Yorkville Luxury Penthouses, Forest Hill Estates, Modernist Architecture"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                />
              </div>

              {/* Bio & Background */}
              <div>
                <label className="text-xs font-bold text-stone-700">Professional Biography & Client Advisory Statement</label>
                <textarea
                  rows={3}
                  value={agentForm.bio || ''}
                  onChange={(e) => setAgentForm({ ...agentForm, bio: e.target.value })}
                  placeholder="Provide an overview of the advisor's experience, market track record, and advisory philosophy..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] mt-1 transition"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  {editingAgentId ? 'Save Advisor Profile' : 'Register Advisor'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
