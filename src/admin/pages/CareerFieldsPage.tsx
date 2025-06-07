import React, { useState, useEffect } from 'react';
import { careerFieldAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CareerField {
  _id: string;
  name: string;
  description?: string;
}

const CareerFieldsPage: React.FC = () => {
  const [careerFields, setCareerFields] = useState<CareerField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldDescription, setNewFieldDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCareerFields = async () => {
    setLoading(true);
    setError(null);
    try {
      // The service now returns the array directly.
      const data = await careerFieldAPI.getAll();
      
      // FIXED: The check is now much simpler. If we get an array, use it.
      if (Array.isArray(data)) {
        setCareerFields(data);
      } else {
        // This is a fallback for an unexpected error.
        throw new Error("API did not return an array for career fields.");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setCareerFields([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerFields();
  }, []);

  const handleDelete = async (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this career field?')) {
      try {
        await careerFieldAPI.delete(fieldId);
        toast({ title: "Success", description: "Career field deleted." });
        fetchCareerFields(); // Refresh the list
      } catch (err: any) {
        toast({ title: "Error", description: err.response?.data?.message || 'Failed to delete.', variant: "destructive" });
      }
    }
  };

  const handleAdd = async () => {
    if (!newFieldName.trim()) {
      toast({ title: "Validation Error", description: "Field name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await careerFieldAPI.create({ name: newFieldName, description: newFieldDescription });
      toast({ title: "Success", description: "Career field added." });
      setNewFieldName('');
      setNewFieldDescription('');
      setIsModalOpen(false);
      fetchCareerFields(); // Refresh the list
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || 'Failed to add field.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Career Fields</CardTitle>
              <CardDescription>Manage career fields for AI Mentors and Protocols.</CardDescription>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Field</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Add New Career Field</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Field Name</Label>
                    <Input id="name" value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" value={newFieldDescription} onChange={(e) => setNewFieldDescription(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAdd} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Field
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
                ) : error ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-red-500 py-8">{error}</TableCell></TableRow>
                ) : careerFields.length > 0 ? (
                  careerFields.map((field) => (
                    <TableRow key={field._id}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell className="text-gray-400">{field.description || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(field._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} className="text-center py-8">No career fields found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerFieldsPage;