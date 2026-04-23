import re

with open('src/pages/Login.jsx', 'r') as f:
    text = f.read()

old_guest_form = r"<form onSubmit=\{handleGuestSubmit\} className=\"space-y-6\">\n\s*<div>\n\s*<label className=\"block text-sm font-medium text-neutral-300 mb-2\">First Name<\/label>"

new_guest_form = """<form onSubmit={handleGuestSubmit} className="space-y-6">
                  {/* Select Avatar UI */}
                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-4">Choose Your Avatar</label>
                      <div className="flex gap-4 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                          {guestAvatars.map(seed => (
                              <div 
                                  key={seed}
                                  onClick={() => setAvatarSeed(seed)}
                                  className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${avatarSeed === seed ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                              >
                                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} alt={seed} className="w-full h-full bg-neutral-800" />
                              </div>
                          ))}
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">First Name</label>"""

text = re.sub(old_guest_form, new_guest_form, text)

with open('src/pages/Login.jsx', 'w') as f:
    f.write(text)

print("Login page padded with avatar picker")
