import React, { useState, useEffect } from 'react';
import { missionAPI } from '../services/api';
import { Pencil, Trash2, Search, Plus, Filter, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Mission {
  _id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  careerFields: { _id: string, name: string }[]; 
  skills: string[];
  steps: { order: number; title: string; description: string; completionCriteria: string; }[];
  estimatedDuration: {
    value: number;
    unit: string;
  };
  rewards: {
    experience: number;
    skillPoints: number;
  };
  isActive: boolean;
}

const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formSteps, setFormSteps] = useState([{ title: '', description: '', completionCriteria: '' }]);
  const [formSkills, setFormSkills] = useState('');

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await missionAPI.getAllMissions(currentPage, 10);
      
      // FIXED: The array of missions is at response.data, and pagination is at response.pagination
      if (response && Array.isArray(response.data) && response.pagination) {
        setMissions(response.data);
        setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
      } else {
        setMissions([]);
        setTotalPages(1);
        console.error("Unexpected response structure:", response);
        setError("Received an unexpected data format from the server.");
      }
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message || 'Failed to fetch missions');
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [currentPage]);

  const handleEditMission = (mission: Mission) => {
    setSelectedMission(mission);
    setFormSteps(mission.steps?.map(({order, ...rest}) => rest) || [{ title: '', description: '', completionCriteria: '' }]);
    setFormSkills(mission.skills?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleAddMissionClick = () => {
    setSelectedMission(null);
    setFormSteps([{ title: '', description: '', completionCriteria: '' }]);
    setFormSkills('');
    setIsModalOpen(true);
  }

  const handleDeleteMission = async (missionId: string) => {
    if (window.confirm('Are you sure you want to delete this mission?')) {
      try {
        await missionAPI.deleteMission(missionId);
        toast({ title: "Success", description: "Mission deleted." });
        fetchMissions(); // Refresh the list
      } catch (err: any) {
        toast({ title: "Error", description: err.message || 'Failed to delete mission', variant: "destructive" });
      }
    }
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...formSteps];
    newSteps[index][field] = value;
    setFormSteps(newSteps);
  };
  
  const addStep = () => {
    setFormSteps([...formSteps, { title: '', description: '', completionCriteria: '' }]);
  };

  const removeStep = (index: number) => {
    const newSteps = formSteps.filter((_, i) => i !== index);
    setFormSteps(newSteps);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const simpleData = Object.fromEntries(formData.entries());

    const payload = {
      title: simpleData.title,
      description: simpleData.description,
      type: simpleData.type,
      difficulty: simpleData.difficulty,
      careerFields: ["60d21b4667d0d8992e610c85"], // Mock ID as per backend docs
      skills: formSkills.split(',').map(s => s.trim()).filter(Boolean),
      steps: formSteps.map((step, index) => ({ ...step, order: index })),
      estimatedDuration: {
        value: Number(simpleData.durationValue),
        unit: simpleData.durationUnit,
      },
      rewards: {
        experience: Number(simpleData.rewardExperience),
        skillPoints: Number(simpleData.rewardSkillPoints),
      },
      isActive: simpleData.isActive === 'true',
    };

    try {
        if (selectedMission) {
            await missionAPI.updateMission(selectedMission._id, payload);
            toast({ title: "Success", description: "Mission updated successfully." });
        } else {
            await missionAPI.createMission(payload);
            toast({ title: "Success", description: "Mission created successfully." });
        }
        setIsModalOpen(false);
        fetchMissions(); // Refresh the list
    } catch (err: any) {
        toast({ title: "Error", description: err.response?.data?.error?.message || 'Submission failed. Please check all fields.', variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const formatTime = (duration?: { value: number; unit: string; }) => {
    if (!duration || typeof duration.value === 'undefined' || !duration.unit) {
        return 'N/A';
    }
    return `${duration.value} ${duration.unit}`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Missions</h1>
          <p className="text-gray-400 mt-1">Manage career guidance missions</p>
        </div>
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleAddMissionClick}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Mission
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        {/* ... (Search and Filter UI is unchanged and correct) ... */}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            {/* ... (Table Head is unchanged and correct) ... */}
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => ( <tr key={i}>...</tr> ))
              ) : Array.isArray(missions) && missions.length > 0 ? (
                missions.map((mission) => (
                  <tr key={mission._id}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-white">{mission.title}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{mission.type}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(mission.difficulty)}`}>{mission.difficulty}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-300">{formatTime(mission.estimatedDuration)}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mission.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{mission.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditMission(mission)} className="text-purple-400 hover:text-purple-300 mr-3"><Pencil className="h-5 w-5" /></button>
                      <button onClick={() => handleDeleteMission(mission._id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-5 w-5" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-400">No missions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* ... (Pagination UI is unchanged and correct) ... */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedMission ? 'Edit Mission' : 'Add New Mission'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... (The enhanced form JSX is unchanged and correct) ... */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;