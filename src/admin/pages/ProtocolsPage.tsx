import React, { useState, useEffect } from 'react';
import { protocolAPI } from '../services/api';
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// interface Milestone {
//   title: string;
//   description: string;
//   order: number;
// }

interface Protocol {
  _id: string;
  title: string;
  description: string;
  targetLevel: string;
  careerFields: string[];
  estimatedDuration: {
    value: number;
    unit: string;
  };
  phases: { title: string, order: number, milestones: { title: string, order: number, missions: string[] }[] }[];
  isActive: boolean;
}

const ProtocolsPage: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchProtocols = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolAPI.getAllProtocols(currentPage, 10);
      
      if (response && Array.isArray(response.data) && response.pagination) {
        setProtocols(response.data);
        setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
      } else {
        setProtocols([]);
        setTotalPages(1);
        console.error("Unexpected response structure from protocol API:", response);
        setError("Received an unexpected data format for protocols.");
      }
    } catch (err: any) {
      console.error('Error fetching protocols:', err);
      setError(err.message || 'Failed to fetch protocols');
      setProtocols([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, [currentPage]);

  const handleEditProtocol = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setIsModalOpen(true);
  };

  const handleAddProtocolClick = () => {
    setSelectedProtocol(null);
    setIsModalOpen(true);
  }

  const handleDeleteProtocol = async (protocolId: string) => {
    if (window.confirm('Are you sure you want to delete this protocol?')) {
      try {
        await protocolAPI.deleteProtocol(protocolId);
        toast({ title: "Success", description: "Protocol deleted." });
        fetchProtocols();
      } catch (err: any) {
        toast({ title: "Error", description: err.message || 'Failed to delete protocol', variant: "destructive" });
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    const payload = {
        title: formData.get('title'),
        description: formData.get('description'),
        targetLevel: formData.get('targetLevel'),
        careerFields: ["60d21b4667d0d8992e610c85"], // Mock ID as per backend docs
        estimatedDuration: {
            value: Number(formData.get('durationValue')),
            unit: formData.get('durationUnit'),
        },
        isActive: formData.get('isActive') === 'true',
        phases: [
          {
            title: formData.get('phaseTitle') || 'First Phase',
            description: "First phase of the protocol.",
            order: 0,
            milestones: [
              {
                title: formData.get('milestoneTitle') || 'First Milestone',
                description: "First milestone of the protocol.",
                order: 0,
                missions: ["60d21b4667d0d8992e610c87"] // Mock Mission ID
              }
            ]
          }
        ],
        prerequisites: { skills: [] }
    };

    try {
        if (selectedProtocol) {
            await protocolAPI.updateProtocol(selectedProtocol._id, payload);
            toast({ title: "Success", description: "Protocol updated successfully." });
        } else {
            await protocolAPI.createProtocol(payload);
            toast({ title: "Success", description: "Protocol created successfully." });
        }
        setIsModalOpen(false);
        fetchProtocols();
    } catch (err: any) {
        toast({ title: "Error", description: err.response?.data?.error?.message || 'Submission failed.', variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  };


  const toggleProtocolExpansion = (protocolId: string) => {
    setExpandedProtocol(expandedProtocol === protocolId ? null : protocolId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Protocols</h1>
          <p className="text-gray-400 mt-1">Manage learning paths and protocols</p>
        </div>
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleAddProtocolClick}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Protocol
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse h-20"></div>
            ))
          ) : Array.isArray(protocols) && protocols.length > 0 ? (
            protocols.map((protocol) => (
              <div key={protocol._id} className="bg-gray-700 rounded-lg overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-650 flex justify-between items-center"
                  onClick={() => toggleProtocolExpansion(protocol._id)}
                >
                  <div>
                    <h3 className="text-lg font-medium text-white">{protocol.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-400">Level: {protocol.targetLevel}</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${protocol.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {protocol.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEditProtocol(protocol); }} className="text-purple-400 hover:text-purple-300 p-1"><Pencil className="h-5 w-5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProtocol(protocol._id); }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="h-5 w-5" /></button>
                    {expandedProtocol === protocol._id ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
                {expandedProtocol === protocol._id && (
                  <div className="p-4 border-t border-gray-600 bg-gray-750">
                    <p className="text-sm text-gray-400 mb-4">{protocol.description}</p>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Phases & Milestones</h4>
                    {protocol.phases?.length > 0 ? (
                      protocol.phases.map((phase, pIndex) => (
                        <div key={pIndex} className="mb-2">
                           <h5 className="font-semibold text-gray-200">{phase.title}</h5>
                           <ul className="list-disc list-inside text-sm text-gray-400 pl-4">
                            {phase.milestones?.map((milestone, mIndex) => <li key={mIndex}>{milestone.title}</li>)}
                           </ul>
                        </div>
                      ))
                    ) : <p className="text-sm text-gray-500">No phases or milestones defined.</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">No protocols found</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedProtocol ? 'Edit Protocol' : 'Add New Protocol'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Protocol Title</label><input name="title" type="text" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md" defaultValue={selectedProtocol?.title || ''} required /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Description</label><textarea name="description" rows={3} className="bg-gray-700 text-white w-full px-4 py-2 rounded-md" defaultValue={selectedProtocol?.description || ''}></textarea></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1">Target Level</label><select name="targetLevel" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md" defaultValue={selectedProtocol?.targetLevel || 'intermediate'}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-400 mb-1">Duration Value</label><input name="durationValue" type="number" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md" defaultValue={selectedProtocol?.estimatedDuration?.value || 6} min={1}/></div>
                  <div><label className="block text-sm font-medium text-gray-400 mb-1">Duration Unit</label><select name="durationUnit" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md" defaultValue={selectedProtocol?.estimatedDuration?.unit || 'months'}><option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option></select></div>
              </div>
              
              <div className="p-3 border border-gray-600 rounded-md">
                 <h3 className="text-md font-semibold text-gray-200 mb-2">Initial Structure</h3>
                 <div className="space-y-2">
                    <div><label className="block text-sm font-medium text-gray-400 mb-1">Phase 1 Title</label><input name="phaseTitle" type="text" className="bg-gray-600 text-white w-full px-3 py-1 rounded-md" defaultValue={selectedProtocol?.phases?.[0]?.title || "Fundamentals"} required /></div>
                    <div><label className="block text-sm font-medium text-gray-400 mb-1">Milestone 1 Title</label><input name="milestoneTitle" type="text" className="bg-gray-600 text-white w-full px-3 py-1 rounded-md" defaultValue={selectedProtocol?.phases?.[0]?.milestones?.[0]?.title || "Getting Started"} required /></div>
                 </div>
              </div>

              <div><label className="block text-sm font-medium text-gray-400 mb-1">Status</label><select name="isActive" className="bg-gray-700 text-white w-full px-4 py-2 rounded-md" defaultValue={String(selectedProtocol?.isActive ?? true)}><option value="true">Active</option><option value="false">Inactive</option></select></div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center min-w-[100px] disabled:opacity-50">{isSubmitting ? <Loader2 className="animate-spin" /> : (selectedProtocol ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolsPage;