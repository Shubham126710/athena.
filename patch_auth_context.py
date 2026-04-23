import re

with open('src/context/AuthContext.jsx', 'r') as f:
    text = f.read()

old_update = """  async function updateProfile(updates) {
    if (!user || user.id === 'guest') return;
    
    // Optimistic update
    const previousProfile = profile;
    setProfile(prev => ({ ...prev, ...updates }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile in DB:', error);
        // Revert on error
        setProfile(previousProfile);
        throw error;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfile(previousProfile);
      throw error;
    }
  }"""

new_update = """  async function updateProfile(updates) {
    if (!user) return;
    
    // Optimistic update
    const previousProfile = profile;
    const newProfile = { ...previousProfile, ...updates };
    setProfile(newProfile);

    if (user.id === 'guest') {
      localStorage.setItem('guest_user', JSON.stringify(newProfile));
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile in DB:', error);
        // Revert on error
        setProfile(previousProfile);
        throw error;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfile(previousProfile);
      throw error;
    }
  }"""

text = text.replace(old_update, new_update)

with open('src/context/AuthContext.jsx', 'w') as f:
    f.write(text)

print("Auth context updated to allow guest profile updates.")
