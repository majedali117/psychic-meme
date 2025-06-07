import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mentorAPI, careerFieldAPI } from '../services/api';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Mentor {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  profileImage?: string;
  careerFields: any[]; // Can be an array of strings (IDs) or objects
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills?: string[];
  teachingStyle: 'practical' | 'theoretical' | 'socratic' | 'coaching' | 'mentoring';
  communicationStyle: 'direct' | 'supportive' | 'analytical' | 'expressive';
  manusAIMentorId: string;
  rating: number;
  isActive: boolean;
}

interface CareerField {
    _id: string;
    name: string;
}

const MentorsPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [careerFields, setCareerFields] = useState<CareerField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const initialFormData = {
    name: '',
    title: '',
    specialization: '',
    bio: '',
    profileImage: '',
    careerFields: [],
    experienceLevel: 'expert' as const,
    skills: [],
    teachingStyle: 'mentoring' as const,
    communicationStyle: 'supportive' as const,
    manusAIMentorId: '',
    rating: 5,
    isActive: true,
  };

  const [formData, setFormData] = useState<Partial<Mentor>>(initialFormData);
  const [formSkills, setFormSkills] = useState('');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
        const [mentorRes, careerFieldRes] = await Promise.all([
            mentorAPI.getAllMentors(currentPage, 10),
            careerFieldAPI.getAll()
        ]);

        if (mentorRes && Array.isArray(mentorRes.data) && mentorRes.pagination) {
            setMentors(mentorRes.data);
            setTotalPages(Math.ceil(mentorRes.pagination.total / mentorRes.pagination.limit));
        } else {
            setMentors([]);
            setTotalPages(1);
        }

        if (Array.isArray(careerFieldRes)) {
            setCareerFields(careerFieldRes);
        } else {
            setCareerFields([]);
        }

    } catch (err: any) {
      setError('Failed to fetch page data. Please try again.');
      setMentors([]);
      setCareerFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: keyof Mentor, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const openAddDialog = () => {
    setSelectedMentor(null);
    setFormData({...initialFormData, careerField: careerFields[0]?._id});
    setFormSkills('');
    setIsModalOpen(true);
  };

  const openEditDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setFormData({ 
        name: mentor.name || '',
        title: mentor.title || '',
        specialization: mentor.specialization || '',
        bio: mentor.bio || '',
        profileImage: mentor.profileImage || '',
        // Handle both populated objects and simple IDs
        careerField: Array.isArray(mentor.careerFields) && mentor.careerFields.length > 0
            ? (typeof mentor.careerFields[0] === 'object' ? mentor.careerFields[0]?._id : mentor.careerFields[0])
            : '',
        experienceLevel: mentor.experienceLevel || 'expert',
        teachingStyle: mentor.teachingStyle || 'mentoring',
        communicationStyle: mentor.communicationStyle || 'supportive',
        manusAIMentorId: mentor.manusAIMentorId || '',
        rating: mentor.rating || 5,
        isActive: typeof mentor.isActive === 'boolean' ? mentor.isActive : true,
    });
    setFormSkills(Array.isArray(mentor.skills) ? mentor.skills.join(', ') : '');
    setIsModalOpen(true);
  };
  
  const handleDeleteMentor = async (mentorId: string) => {
    if(window.confirm('Are you sure you want to delete this mentor?')){
        try {
            await mentorAPI.deleteMentor(mentorId);
            toast({ title: "Success", description: "Mentor deleted successfully" });
            fetchData();
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to delete mentor.", variant: "destructive" });
        }
    }
  };
  
  const handleSubmit = async () => {
    const { name, manusAIMentorId, careerField, bio } = formData;
    if (!name?.trim() || !manusAIMentorId?.trim() || !careerField || !bio?.trim()) {
      toast({ title: "Validation Error", description: "Name, Manus AI ID, Bio, and Career Field are required.", variant: "destructive" });
      return;
    }
    setFormSubmitting(true);
    
    const payload = {
        ...formData,
        experience: Number(formData.experience) || 0,
        rating: Number(formData.rating) || 5,
        careerFields: formData.careerField ? [formData.careerField] : [],
        skills: formSkills.split(',').map(skill => skill.trim()).filter(Boolean),
    };
    
    // Remove the singular careerField property before sending
    delete payload.careerField;

    try {
      if (selectedMentor) {
        await mentorAPI.updateMentor(selectedMentor._id, payload);
        toast({ title: "Success", description: "Mentor updated successfully" });
      } else {
        await mentorAPI.createMentor(payload);
        toast({ title: "Success", description: "Mentor added successfully" });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to save mentor.", variant: "destructive" });
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Mentors Management</CardTitle>
          <CardDescription>Manage AI mentors for the TimeTravelers platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
                ) : error ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-red-500 py-8">{error}</TableCell></TableRow>
                ) : mentors.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No mentors found</TableCell></TableRow>
                ) : (
                  mentors.map((mentor) => (
                    <TableRow key={mentor._id}>
                      <TableCell className="font-medium">{mentor.name}</TableCell>
                      <TableCell>{mentor.title}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded-full text-xs ${mentor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{mentor.isActive ? 'Active' : 'Inactive'}</span></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(mentor)} className="mr-1"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMentor(mentor._id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{selectedMentor ? 'Edit Mentor' : 'Add New Mentor'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} /></div>
                <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} /></div>
            </div>
            
            <div className="space-y-2"><Label htmlFor="careerField">Career Field *</Label><Select value={formData.careerField} onValueChange={(value) => handleSelectChange('careerField', value)}><SelectTrigger id="careerField"><SelectValue placeholder="Select a field..." /></SelectTrigger><SelectContent>{careerFields.map(field => (<SelectItem key={field._id} value={field._id}>{field.name}</SelectItem>))}</SelectContent></Select></div>
            
            <div className="space-y-2"><Label htmlFor="specialization">Specialization *</Label><Input id="specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="manusAIMentorId">Manus AI Mentor ID *</Label><Input id="manusAIMentorId" name="manusAIMentorId" value={formData.manusAIMentorId} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="bio">Bio *</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="skills">Skills (comma-separated)</Label><Input id="skills" value={formSkills} onChange={(e) => setFormSkills(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="profileImage">Profile Image URL</Label><Input id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleInputChange} /></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="experienceLevel">Experience Level</Label><Select value={formData.experienceLevel} onValueChange={(value) => handleSelectChange('experienceLevel', value)}><SelectTrigger id="experienceLevel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem><SelectItem value="expert">Expert</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="teachingStyle">Teaching Style</Label><Select value={formData.teachingStyle} onValueChange={(value) => handleSelectChange('teachingStyle', value)}><SelectTrigger id="teachingStyle"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="practical">Practical</SelectItem><SelectItem value="theoretical">Theoretical</SelectItem><SelectItem value="socratic">Socratic</SelectItem><SelectItem value="coaching">Coaching</SelectItem><SelectItem value="mentoring">Mentoring</SelectItem></SelectContent></Select></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="communicationStyle">Communication Style</Label><Select value={formData.communicationStyle} onValueChange={(value) => handleSelectChange('communicationStyle', value)}><SelectTrigger id="communicationStyle"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="direct">Direct</SelectItem><SelectItem value="supportive">Supportive</SelectItem><SelectItem value="analytical">Analytical</SelectItem><SelectItem value="expressive">Expressive</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="isActive">Status</Label><Select value={String(formData.isActive)} onValueChange={(value) => handleSelectChange('isActive', value === 'true')}><SelectTrigger id="isActive"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="true">Active</SelectItem><SelectItem value="false">Inactive</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={formSubmitting}>
              {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedMentor ? 'Update Mentor' : 'Add Mentor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorsPage;