import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Updating dates...");
    
    // Domain Camp: June 8 - 19
    const {error: e1} = await supabase.from('notifications').update({
        title: 'Domain Camp: June 8 - 19',
        message: 'Prepare for an immersive week of domain-specific training. Check your updated timetable for details.'
    }).like('title', 'Domain Camp%');
    
    // Winning Camp: May 25 - June 6
    const {error: e2} = await supabase.from('notifications').update({
        title: 'Winning Camp: May 25 - June 6',
        message: 'The final sprint begins soon. Join the Winning Camp for DCPD classes to maximize your performance before the break.'
    }).like('title', 'Winning Camp%');
    
    console.log(e1, e2);
}
run();
