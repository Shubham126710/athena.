import re

with open('src/pages/Landing.jsx', 'r') as f:
    content = f.read()

# 1. Update the Hit Counter
old_counter = r"const \[views, setViews\] = React\.useState\(0\);\n  React\.useEffect\(\(\) => \{ fetch\('https:\/\/api\.counterapi\.dev\/v1\/athena\/hits\/up'\)\.then\(res => res\.json\(\)\)\.then\(data => setViews\(data\.count \|\| 1337\)\)\.catch\(\(\) => \{\}\); \}, \[\]\);"
new_counter = """const [views, setViews] = React.useState(0);
  React.useEffect(() => { 
    let localHits = parseInt(localStorage.getItem('athena_site_hits') || '0', 10);
    localHits += 1;
    localStorage.setItem('athena_site_hits', localHits);
    setViews(localHits);
  }, []);"""
content = re.sub(old_counter, new_counter, content)

# 2. Enhance the Hero Section
old_hero = r"<h1 className=\"text-6xl md:text-7xl font-bold tracking-tighter leading-\[0\.95\] mb-8 text-white min-h-\[240px\]\">\n(.*?)academic <span className=\"text-neutral-500\">\{text\}<\/span><span className=\"animate-pulse\">_<\/span>\n\s*<\/h1>"
new_hero = """<h1 className="text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-extrabold tracking-tighter leading-[1.05] mb-8 text-white min-h-[240px] drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400">Your digital</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500">academic</span> <br className="hidden md:block"/>
              <span className="text-neutral-300 italic pr-2">{text}</span><span className="animate-pulse text-white">_</span>
            </h1>"""
content = re.sub(old_hero, new_hero, content, flags=re.DOTALL)

# 3. Enhance the Avatar
old_avatar = r"https://api\.dicebear\.com/7\.x/notionists/svg\?seed=Shubham"
new_avatar = "https://api.dicebear.com/7.x/micah/svg?seed=Shubh&backgroundColor=transparent"
content = content.replace(old_avatar, new_avatar)

with open('src/pages/Landing.jsx', 'w') as f:
    f.write(content)

print("Landing page patched")
