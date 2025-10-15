import { useGetCoolersQuery } from '@/app/state/api';
import { useAppSelector } from '@/app/state/redux';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Cooler } from '@/app/lib/schemas';

const DynamicCoolerLocationMap = dynamic(() => import('@/components/CoolersMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

const List = () => {
    const filters = useAppSelector((state) => state.global.filters);
    const [selectedCooler, setSelectedCooler] = useState<Cooler | null>(null);

    const {
        data: coolers,
        isLoading, 
        isError
    } = useGetCoolersQuery(filters);

    if (isLoading) return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading coolers...</p>
            </div>
        </div>
    );
    
    if (isError || !coolers) return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-red-600">
                <p>Failed to fetch coolers</p>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-background rounded-lg border p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
                Coolers List ({coolers.length} total)
                {filters.location && (
                    <span className="text-muted-foreground font-normal text-sm ml-2">
                        in {filters.location}
                    </span>
                )}
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-3 text-left font-semibold">Serial Number</th>
                            <th className="p-3 text-left font-semibold">Name</th>
                            <th className="p-3 text-left font-semibold">Status</th>
                            <th className="p-3 text-left font-semibold">City</th>
                            <th className="p-3 text-left font-semibold">Province</th>
                            <th className="p-3 text-left font-semibold">Country</th>
                            <th className="p-3 text-left font-semibold">Coordinates</th>
                            <th className="p-3 text-left font-semibold">Installed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coolers.map(cooler => (
                            <tr 
                                key={cooler._id} 
                                className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => setSelectedCooler(cooler)}
                            >
                                <td className="p-3 font-mono text-xs font-semibold">{cooler._id}</td>
                                <td className="p-3 font-medium">
                                    <a 
                                        href={`/search/${cooler._id}`} 
                                        className="text-primary hover:underline"
                                    >
                                        {cooler.name}
                                    </a>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        cooler.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        cooler.status === 'Alert' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {cooler.status}
                                    </span>
                                </td>
                                <td className="p-3">{cooler.location.city}</td>
                                <td className="p-3">{cooler.location.province}</td>
                                <td className="p-3">{cooler.location.country}</td>
                                <td className="p-3 font-mono text-xs">
                                    {cooler.location.coordinates[1].toFixed(4)}, {cooler.location.coordinates[0].toFixed(4)}
                                </td>
                                <td className="p-3 text-xs text-muted-foreground">
                                    {cooler.createdAt ? new Date(cooler.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cooler Location Modal */}
            <Dialog open={!!selectedCooler} onOpenChange={(open) => !open && setSelectedCooler(null)}>
                <DialogContent className="max-w-4xl w-full h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Cooler Location - {selectedCooler?.name}</DialogTitle>
                        <DialogDescription>
                            {selectedCooler && (
                                <div className="flex flex-col gap-3 mt-2">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-semibold">Serial Number:</span> {selectedCooler._id}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Status:</span>{' '}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedCooler.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedCooler.status}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">City:</span> {selectedCooler.location.city}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Province:</span> {selectedCooler.location.province}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Country:</span> {selectedCooler.location.country}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Coordinates:</span>{' '}
                                            {selectedCooler.location.coordinates[1].toFixed(4)}, {selectedCooler.location.coordinates[0].toFixed(4)}
                                        </div>
                                    </div>
                                    <div className="border rounded bg-muted p-2 h-[500px]">
                                        <DynamicCoolerLocationMap coolers={[selectedCooler]} />
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default List;