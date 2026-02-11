export interface GalleryItem {
    id: string;
    type: 'video' | 'image';
    url: string;
    title: string;
    category: string;
    description: string;
}

export const workGallery: GalleryItem[] = [
    {
        id: 'tv-fix-1',
        type: 'video',
        url: '/videos/TVFixedVideo1.mp4',
        title: 'LED TV Panel Repair',
        category: 'TV Repair',
        description: 'Successful restoration of a 4K LED TV panel with display bonding issues.'
    },
    {
        id: 'tv-fix-2',
        type: 'video',
        url: '/videos/TVFixedVideo2.mp4',
        title: 'Smart TV Mainboard Diagnostic',
        category: 'TV Repair',
        description: 'Chip-level repair on a smart TV mainboard to fix power-on failure.'
    },
    {
        id: 'meter-fix-1',
        type: 'video',
        url: '/videos/BikeDigitalMeterFix1.mp4',
        title: 'Motorcycle Digital Meter Restoration',
        category: 'Meter Repair',
        description: 'Fixing fading display and sensor issues on a digital motorcycle cluster.'
    },
    {
        id: 'meter-fix-2',
        type: 'video',
        url: '/videos/BikeDigitalMeterFix2.mp4',
        title: 'Digital Cluster Calibration',
        category: 'Meter Repair',
        description: 'Recalibrating a digital meter after circuit board repair.'
    },
    {
        id: 'meter-fix-3',
        type: 'video',
        url: '/videos/BikeDigitalMeterFix3.mp4',
        title: 'Backlight Replacement',
        category: 'Meter Repair',
        description: 'Replacing faulty backlight LEDs in a vehicle digital display.'
    },
    {
        id: 'meter-fix-4',
        type: 'video',
        url: '/videos/BikeDigitalMeterFix4.mp4',
        title: 'Water Damage Repair',
        category: 'Meter Repair',
        description: 'Cleaning and repairing a water-damaged digital meter PCB.'
    },
    {
        id: 'oven-fix-1',
        type: 'video',
        url: '/videos/OvenFix1.mp4',
        title: 'Microwave Oven Controller Fix',
        category: 'Home Appliances',
        description: 'Repairing the electronic control board of a modern convection oven.'
    },
    {
        id: 'tv-image-1',
        type: 'image',
        url: '/videos/TVFixed.jpeg',
        title: 'TV Display Success',
        category: 'TV Repair',
        description: 'Final result of an LCD panel repair showing crystal clear image.'
    },
    {
        id: 'power-fix-1',
        type: 'image',
        url: '/videos/PowerSupplyFixed.jpeg',
        title: 'Power Supply Unit Repair',
        category: 'Electronics',
        description: 'Rebuilt power supply unit for high-end electronic equipment.'
    },
    {
        id: 'shop-1',
        type: 'image',
        url: '/videos/ShopAppearance.jpeg',
        title: 'Our Workshop',
        category: 'Facility',
        description: 'Modern diagnostic laboratory equipped for chip-level electronics repair.'
    }
];
