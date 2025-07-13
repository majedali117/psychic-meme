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
import { Loader2, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// FIXED: Updated interface to match the complete AIMentor model from the provided JSON
interface Mentor {
  _id: string;
  name: string;
  title?: string;
  specialization: string;
  bio: string;
  profileImage?: string;
  careerFields: any[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills?: string[];
  tags?: string[];
  languages?: string[];
  availability?: string;
  teachingStyle: 'practical' | 'theoretical' | 'socratic' | 'coaching' | 'mentoring';
  communicationStyle: 'direct' | 'supportive' | 'analytical' | 'expressive';
  geminiMentorId: string; // Corrected field name
  manusAIMentorId: string;
  manus: string; // Corrected field name
  rating: number;
  reviewCount: number;
  sessionCount: number;
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
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null);
  
  const initialFormData: Partial<Mentor> = {
    name: '',
    specialization: '',
    bio: '',
    profileImage: '',
    careerFields: [],
    experienceLevel: 'expert',
    skills: [],
    tags: [],
    languages: [],
    availability: 'always',
    teachingStyle: 'mentoring',
    communicationStyle: 'supportive',
    geminiMentorId: '',
    manusAIMentorId: '',
    rating: 5,
    isActive: true,
  };

  const [formData, setFormData] = useState<Partial<Mentor>>(initialFormData);
  const [formSkills, setFormSkills] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formLanguages, setFormLanguages] = useState('');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('asadad');
        const [mentorRes, careerFieldRes] = await Promise.all([
            mentorAPI.getAllMentors(),
            careerFieldAPI.getAll()
        ]);
        
        console.log(mentorRes.data);
        if (mentorRes && Array.isArray(mentorRes.data)) setMentors(mentorRes.data);
        if (Array.isArray(careerFieldRes)) setCareerFields(careerFieldRes);

    } catch (err: any) {
      setError('Failed to fetch page data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: keyof Mentor, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const openAddDialog = () => {
    setSelectedMentor(null);
    setFormData({...initialFormData, careerFields: careerFields[0] ? [careerFields[0]] : []});
    setFormSkills('');
    setFormTags('');
    setFormLanguages('');
    setIsModalOpen(true);
  };

  const openEditDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setFormData({ 
        ...initialFormData,
        ...mentor,
        careerFields: Array.isArray(mentor.careerFields) ? mentor.careerFields : [mentor.careerFields].filter(Boolean),
    });
    setFormSkills(Array.isArray(mentor.skills) ? mentor.skills.join(', ') : '');
    setFormTags(Array.isArray(mentor.tags) ? mentor.tags.join(', ') : '');
    setFormLanguages(Array.isArray(mentor.languages) ? mentor.languages.join(', ') : '');
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
    const { name, geminiMentorId, careerFields, bio, specialization } = formData;
    if (!name?.trim() || !geminiMentorId?.trim() || !careerFields?.length || !bio?.trim() || !specialization?.trim()) {
      toast({ title: "Validation Error", description: "All fields marked with * are required.", variant: "destructive" });
      return;
    }
    setFormSubmitting(true);
    
    // FIXED: Construct a complete payload matching the schema
    const payload = {
        ...formData,
        rating: Number(formData.rating) || 5,
        careerFields: formData.careerFields || [],
        skills: formSkills.split(',').map(skill => skill.trim()).filter(Boolean),
        tags: formTags.split(',').map(tag => tag.trim()).filter(Boolean),
        languages: formLanguages.split(',').map(lang => lang.trim()).filter(Boolean),
    };

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
          <CardDescription>Manage AI mentors for the Agentive Buddy platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6"><Button onClick={openAddDialog}><Plus className="h-4 w-4 mr-2" />Add Mentor</Button></div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
                : error ? <TableRow><TableCell colSpan={4} className="text-center text-red-500 py-8">{error}</TableCell></TableRow>
                : mentors.map((mentor) => (
                    <React.Fragment key={mentor._id}>
                        <TableRow className="cursor-pointer" onClick={() => setExpandedMentorId(expandedMentorId === mentor._id ? null : mentor._id)}>
                            <TableCell className="font-medium flex items-center">{mentor.name} <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${expandedMentorId === mentor._id ? 'rotate-180' : ''}`} /></TableCell>
                            <TableCell>{mentor.specialization}</TableCell>
                            <TableCell><span className={`px-2 py-1 rounded-full text-xs ${mentor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{mentor.isActive ? 'Active' : 'Inactive'}</span></TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditDialog(mentor);}}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteMentor(mentor._id);}}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                        {expandedMentorId === mentor._id && (
                            <TableRow className="bg-gray-800/50">
                                <TableCell colSpan={4} className="p-4 space-y-2">
                                    <p><strong className="text-gray-300">Bio:</strong> {mentor.bio}</p>
                                    <p><strong className="text-gray-300">Skills:</strong> {mentor.skills?.join(', ') || 'N/A'}</p>
                                    <p><strong className="text-gray-300">Rating:</strong> {mentor.rating} ({mentor.reviewCount} reviews)</p>
                                    <p><strong className="text-gray-300">Gemini ID:</strong> {mentor.geminiMentorId}</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                ))}
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
              <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="careerFields">Career Field *</Label><Select value={formData.careerFields?.[0]?._id || ''} onValueChange={(value) => handleSelectChange('careerFields', value)}><SelectTrigger id="careerFields"><SelectValue placeholder="Select a field..." /></SelectTrigger><SelectContent>{careerFields.map(field => (<SelectItem key={field._id} value={field._id}>{field.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="specialization">Specialization *</Label><Input id="specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} /></div>
            {/* FIXED: Renamed to geminiMentorId */}
            <div className="space-y-2"><Label htmlFor="geminiMentorId">Gemini AI Mentor ID *</Label><Input id="geminiMentorId" name="geminiMentorId" value={formData.geminiMentorId} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="bio">Bio *</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="skills">Skills (comma-separated)</Label><Input id="skills" value={formSkills} onChange={(e) => setFormSkills(e.target.value)} /></div>
            {/* ADDED: New required fields */}
            <div className="space-y-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" value={formTags} onChange={(e) => setFormTags(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="languages">Languages (comma-separated)</Label><Input id="languages" value={formLanguages} onChange={(e) => setFormLanguages(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="profileImage">Profile Image URL</Label><Input id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleInputChange} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="experienceLevel">Experience Level</Label><Select value={formData.experienceLevel} onValueChange={(value) => handleSelectChange('experienceLevel', value)}><SelectTrigger id="experienceLevel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem><SelectItem value="expert">Expert</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="teachingStyle">Teaching Style</Label><Select value={formData.teachingStyle} onValueChange={(value) => handleSelectChange('teachingStyle', value)}><SelectTrigger id="teachingStyle"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="practical">Practical</SelectItem><SelectItem value="theoretical">Theoretical</SelectItem><SelectItem value="socratic">Socratic</SelectItem><SelectItem value="coaching">Coaching</SelectItem><SelectItem value="mentoring">Mentoring</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="communicationStyle">Communication Style</Label><Select value={formData.communicationStyle} onValueChange={(value) => handleSelectChange('communicationStyle', value)}><SelectTrigger id="communicationStyle"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="direct">Direct</SelectItem><SelectItem value="supportive">Supportive</SelectItem><SelectItem value="analytical">Analytical</SelectItem><SelectItem value="expressive">Expressive</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="availability">Availability</Label><Select value={formData.availability} onValueChange={(value) => handleSelectChange('availability', value)}><SelectTrigger id="availability"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="always">Always</SelectItem><SelectItem value="weekdays">Weekdays</SelectItem><SelectItem value="weekends">Weekends</SelectItem></SelectContent></Select></div>
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