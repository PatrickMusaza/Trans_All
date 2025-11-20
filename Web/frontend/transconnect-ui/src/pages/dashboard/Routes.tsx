import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload } from "lucide-react";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface Route {
  id: string;
  name: string;
  start_location: string;
  end_location: string;
  distance_km: number;
  fare_amount: number;
  is_active: boolean;
  stops?: any;
}

const Routes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    start_location: "",
    end_location: "",
    distance_km: 0,
    fare_amount: 0,
    stops: [] as Array<{ lat: number; lng: number; name?: string }>,
  });
  const [uploadedCoords, setUploadedCoords] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch routes",
        variant: "destructive",
      });
    } else {
      setRoutes(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          const coordinates = results.data
            .filter((row: any) => row.lat && row.lng)
            .map((row: any) => ({
              lat: parseFloat(row.lat),
              lng: parseFloat(row.lng),
              name: row.name || undefined,
            }));
          
          setFormData({ ...formData, stops: coordinates });
          setUploadedCoords(JSON.stringify(coordinates, null, 2));
          toast({
            title: "File Uploaded",
            description: `Loaded ${coordinates.length} coordinates from CSV`,
          });
        },
        header: true,
        skipEmptyLines: true,
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const coordinates = jsonData
          .filter((row: any) => row.lat && row.lng)
          .map((row: any) => ({
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
            name: row.name || undefined,
          }));
        
        setFormData({ ...formData, stops: coordinates });
        setUploadedCoords(JSON.stringify(coordinates, null, 2));
        toast({
          title: "File Uploaded",
          description: `Loaded ${coordinates.length} coordinates from Excel`,
        });
      };
      reader.readAsBinaryString(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV or XLSX file",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const routeData = {
      ...formData,
      stops: formData.stops.length > 0 ? formData.stops : null,
    };

    const { error } = await supabase
      .from('routes')
      .insert([routeData]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Route added successfully",
      });
      setDialogOpen(false);
      setFormData({
        name: "",
        start_location: "",
        end_location: "",
        distance_km: 0,
        fare_amount: 0,
        stops: [],
      });
      setUploadedCoords("");
      fetchRoutes();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;

    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Route deleted successfully",
      });
      fetchRoutes();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Routes</h1>
            <p className="text-muted-foreground">Manage transportation routes</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Nyabugogo - Kimironko"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_location">Start Location</Label>
                  <Input
                    id="start_location"
                    value={formData.start_location}
                    onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_location">End Location</Label>
                  <Input
                    id="end_location"
                    value={formData.end_location}
                    onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance_km">Distance (km)</Label>
                    <Input
                      id="distance_km"
                      type="number"
                      step="0.1"
                      value={formData.distance_km}
                      onChange={(e) => setFormData({ ...formData, distance_km: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fare_amount">Fare (RWF)</Label>
                    <Input
                      id="fare_amount"
                      type="number"
                      value={formData.fare_amount}
                      onChange={(e) => setFormData({ ...formData, fare_amount: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                {/* CSV/XLSX Upload Section */}
                <div className="space-y-2">
                  <Label>Route Coordinates (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV/XLSX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a file with columns: lat, lng, name (optional)
                  </p>
                  {uploadedCoords && (
                    <Textarea
                      value={uploadedCoords}
                      readOnly
                      className="h-32 font-mono text-xs"
                      placeholder="Uploaded coordinates will appear here"
                    />
                  )}
                </div>

                <Button type="submit" className="w-full">Add Route</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : routes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No routes found
                    </TableCell>
                  </TableRow>
                ) : (
                  routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell>{route.start_location}</TableCell>
                      <TableCell>{route.end_location}</TableCell>
                      <TableCell>{route.distance_km} km</TableCell>
                      <TableCell>RWF {route.fare_amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          route.is_active ? 'bg-success/20 text-success' : 'bg-muted'
                        }`}>
                          {route.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Routes;
