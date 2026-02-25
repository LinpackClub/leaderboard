import csv
import random

# Columns: Team Name, Members, Games Playing, Ice Cream Fight, Dart Game, Balloon Between Us, Face Painting
teams = []

adjectives = ["Super", "Mighty", "Quick", "Silent", "Golden", "Bravo", "Alpha", "Hyper", "Sonic", "Mega", "Ultra", "Elite", "Prime", "Cyber", "Shadow"]
nouns = ["Wolves", "Dragons", "Ninjas", "Titans", "Eagles", "Sharks", "Falcons", "Knights", "Spartans", "Wizards", "Panthers", "Storm", "Phoenix", "Raiders", "Legends"]

first_names = [
    "Arjun", "Deepika", "Rohan", "Sanjana", "Vikram", "Anjali", "Kartik", "Sneha", "Rahul", "Priya",
    "Ishaan", "Kavya", "Aditya", "Meera", "Siddharth", "Ishani", "Yash", "Tanvi", "Pranav", "Rhea",
    "Abhishek", "Bhavna", "Chetan", "Divya", "Eshwar", "Farah", "Gaurav", "Heena", "Inder", "Jaya",
    "Kunal", "Lata", "Manish", "Neha", "Omkar", "Pooja", "Quasim", "Ritu", "Samer", "Tanya",
    "Umesh", "Varun", "Waqar", "Xavier", "Yuvraj", "Zoya", "Aman", "Binita", "Chirag", "Dolly"
]

last_names = ["Sharma", "Verma", "Gupta", "Malhotra", "Kapoor", "Singh", "Patel", "Reddy", "Iyer", "Nair"]

def get_unique_team_name(existing):
    while True:
        name = f"{random.choice(adjectives)} {random.choice(nouns)}"
        if name not in existing:
            return name

def get_unique_members(count):
    # Just sample unique full names
    full_names = []
    while len(full_names) < count:
        fn = f"{random.choice(first_names)} {random.choice(last_names)}"
        if fn not in full_names:
            full_names.append(fn)
    return ", ".join(full_names)

team_names_used = set()

# Generate 50 teams
for i in range(1, 51):
    name = get_unique_team_name(team_names_used)
    team_names_used.add(name)
    
    # 80% play 4 games, 20% play 3 games
    games_playing = 4 if random.random() > 0.2 else 3
    
    # Generate random unique members
    members = get_unique_members(random.randint(3, 5))
    
    # 3G teams get 0 for Ice Cream (and will be marked as Excluded in UI)
    ice_cream = random.randint(30, 95) if games_playing == 4 else 0
    dart = random.randint(20, 100)
    balloon = random.randint(10, 80)
    face = random.randint(5, 50)
    
    teams.append({
        "Team Name": name,
        "Members": members,
        "Games Playing": games_playing,
        "Ice Cream Fight": ice_cream,
        "Dart Game": dart,
        "Balloon Between Us": balloon,
        "Face Painting": face
    })

# Ensure the top team exists
teams[0]["Team Name"] = "The Champions"
teams[0]["Members"] = "John Lennon, Paul McCartney, George Harrison, Ringo Starr"
teams[0]["Ice Cream Fight"] = 100
teams[0]["Dart Game"] = 100
teams[0]["Balloon Between Us"] = 100
teams[0]["Face Painting"] = 100

with open('test_teams.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=teams[0].keys())
    writer.writeheader()
    writer.writerows(teams)

print("test_teams.csv generated with 50 unique teams and member names.")
