import re

with open('src/pages/Syllabus.jsx', 'r') as f:
    text = f.read()

new_syllabi6th = """const syllabi6th = [
    {
      subject: 'Software Engineering', abbr: 'SE', code: '23CSH-374', units: [
        { id: 1, title: 'Software Process and Requirement Engineering', hours: 15, topics: [
          'Software Engineering: Introduction, SDLC, Agile vs Traditional models',
          'Requirement Engineering: Elicitation, Analysis, Specification, Validation',
          'Case Studies: Requirements in online payment systems',
          'Self-Study: Comparison of SDLC models with examples'
        ]},
        { id: 2, title: 'Software Design and Modeling', hours: 15, topics: [
          'Design Concepts, Abstraction, Modularity, Cohesion, Coupling',
          'UML diagrams: Use Case, Class, Sequence, Activity',
          'Design patterns and their applications',
          'Self-Study: UML modeling of a library management system'
        ]},
        { id: 3, title: 'Software Testing, Maintenance & Project Management', hours: 15, topics: [
          'Testing strategies: White box, Black box, Unit testing, Integration testing',
          'Maintenance, Re-engineering, Legacy systems',
          'Software Project Management, CASE tools, Software metrics',
          'Self-Study: Study defect tracking using Jira'
        ]}
      ]
    },
    {
      subject: 'Full Stack II', abbr: 'FS-II', code: '23CSH-382', units: [
        { id: 1, title: 'SPA & API Integration and State Management', hours: 15, topics: [
          'Modern Front-End Architecture & SPA Concepts: Introduction, evolution of SPA, advantages over traditional apps, component-based architecture, client-side routing, interacting with backend services',
          'UI Component Libraries & Design Patterns: Overview of popular UI libraries, reusable component design, separation of concerns',
          'State Management: Local vs global state, Redux architecture (store, actions, reducers), Context API fundamentals',
          'Front-End Case Study & Analysis: Analysis of a real-world frontend app focusing on SPA architecture, API integration, state strategy, UI performance'
        ]},
        { id: 2, title: 'Backend Architecture, Security & API Development', hours: 15, topics: [
          'Scalable Back-End Architecture & Microservices: MVC pattern, layered architecture, microservices principles, service communication',
          'Auth & Security: Application security, user authentication, role-based access control, token-based authentication (JWT)',
          'Real-Time & Serverless: Real-time communication, WebSockets basics, event-driven architecture, Serverless computing and functions-as-a-service',
          'Database Integration: CRUD operations, ORM/ODM, data validation, securing data storage, protecting sensitive data'
        ]},
        { id: 3, title: 'Testing, Deployment & DevOps', hours: 15, topics: [
          'Testing & Debugging Techniques: Unit testing, integration testing, end-to-end testing, resolving front/back-end issues',
          'Testing State Management: Testing Redux/Context API, ensuring data consistency, reliability, handling edge cases',
          'DevOps & CI/CD: DevOps principles, CI/CD pipeline concepts, automated builds, testing, workflows',
          'Containerization & Cloud Deployment: Docker basics, container orchestration, scaling, load balancing, logging & alerting'
        ]}
      ]
    },
    {
      subject: 'Advanced Machine Learning', abbr: 'AML', code: '23CSH-379', units: [
        { id: 1, title: 'Regression & Probability Theory', hours: 15, topics: [
          'Regression: Linear and Polynomial Regression, Maxima and minima of function of one variable, rank, eigen values and vectors, positive & negative definite/semi-definite matrices',
          'Error Estimation: Maxima and minima of function of several variables, Convexity of errors function, building simple linear regression model by solving normal equations, Gradient descent, stochastic & mini-batch gradient descent',
          'Probability Theory: Discrete probability distributions, Continuous probability distributions, normal distribution and t distributions, RSE, R^2'
        ]},
        { id: 2, title: 'Classification & Clustering', hours: 15, topics: [
          'Classification: K-Nearest Neighbour Classifier, Maximum margin classification, Classification errors, regularization, Support vector machine (SVM) and kernels, kernel optimization',
          'Ensemble Learning: Combining classifiers, boosting, margin, and complexity, Naive Bayes, Laplace Smoothing',
          'Clustering: Spectral clustering, Markov models, Hidden Markov models (HMMs) Bayesian networks, Learning Bayesian networks'
        ]},
        { id: 3, title: 'Reinforcement Learning', hours: 15, topics: [
          'Artificial Neural Network: Introduction and Background, Discrimination power of single neuron, Training a single perceptron (delta rule), Multilayer Neural Networks, Activation functions and Loss functions, Backpropagation',
          'Deep Learning: Introduction to end-to-end learning, Abstractions of features using deep layers, Hyper parameter tuning, Regularization for Deep Learning, Dropout'
        ]}
      ]
    },
    {
      subject: 'Artificial Intelligence', abbr: 'AI', code: '23CSH-378', units: [
        { id: 1, title: 'Fundamentals of Artificial Intelligence', hours: 15, topics: [
          'Introduction to AI: AI problems, foundation and history of AI, intelligent agents: Agents and Environments, concept of rationality, structure of agents, problem formulation',
          'Search Strategies in AI: State Space Representation, uniformed search strategies – Breadth first search, depth first search. Informed Search Strategies (Heuristic search) Hill climbing, A*, AO* Algorithms, Constraint Satisfaction Problems',
          'Game Playing and Adversarial Search: Introduction, Adversarial Search Algorithms: Mini-Max Algorithm, Optimal Strategies, Alpha-Beta Pruning, Move Ordering, Game Trees, Real-World Applications'
        ]},
        { id: 2, title: 'Knowledge Representation and Reasoning', hours: 15, topics: [
          'Knowledge Representation issues, predicate logic, logic programming, semantic nets, frames and inheritance, constraint propagation, reasoning under uncertainty',
          'Probability & Uncertainty: Review of probability, Bayes probabilistic interferences and dempster-shafer theory',
          'Propositional and Predicate Logic: First-Order Logic (FOL), Rule-Based Systems & Expert Systems, Ontologies, Fuzzy Logic, Bayesian Networks, Inference in first order logic',
          'Rule-Based Systems and Learning: Forward/Backward Chaining, Resolution, Inductive learning, Decision trees, Statistical Learning methods, Reinforcement Learning'
        ]},
        { id: 3, title: 'Expert Systems & Planning', hours: 15, topics: [
          'Expert systems: Introduction, Difference between expert system and conventional programs, Architecture, Knowledge representation techniques, Knowledge acquisition, Inference Engine, Explanation systems',
          'Planning: Classical planning, Algorithms, Approaches, Planning and acting in real world, Hierarchical planning, Multiagent planning',
          'AI in Robotics and Computer Vision: Overview of Path Planning and Obstacle Avoidance, Object Detection and Recognition using OpenCV, Simultaneous Localization and Mapping (SLAM)'
        ]}
      ]
    },
    {
      subject: 'System Design', abbr: 'SD', code: '23CST-390', units: [
        { id: 1, title: 'Fundamentals of System Design', hours: 15, topics: [
          'Introduction to System Design: Functional & Non-Functional Requirements, Scaling Challenges, Load Balancing, Caching Strategies, Replication, Sharding',
          'Databases in System Design: SQL vs NoSQL, CAP Theorem, Distributed Databases, Consistency Models, Eventual Consistency',
          'High Availability & Architecture: Distributed Caching (Redis, Memcached), High Availability, Fault Tolerance, Microservices vs Monolithic Architecture',
          'Self-Study: Load Balancing Algorithms, Client-Side vs Server-Side Caching, Sharding Strategies'
        ]},
        { id: 2, title: 'Real-World System Architectures', hours: 15, topics: [
          'Web-Scale System Design: Designing for Millions of Users, Rate Limiting, API Gateway, Content Delivery Networks (CDNs)',
          'Messaging & Events: Messaging Queues & Event-Driven Systems (Kafka, RabbitMQ)',
          'Security in System Design: OAuth, JWT, API Security, Rate Limiting',
          'Case Studies: Designing Large-Scale Systems (Netflix, Uber, Facebook, WhatsApp)',
          'Self-Study: Microservices and API Gateway Patterns, Event-Driven Architecture with Kafka'
        ]},
        { id: 3, title: 'Project Development', hours: 15, topics: [
          'Search & Recommendation: Designing Search Engines & Recommendation Systems',
          'Interview Preparation: System Design Questions in FAANG Interviews',
          'System Evaluation: Cost Estimation, Trade-Offs, Optimization Techniques',
          'Self-Study: Search Engine Ranking Algorithms, Collaborative Filtering vs Content-Based Recommendation, Cost Estimation in Distributed Systems'
        ]}
      ]
    }
  ];"""

text = re.sub(
    r'const syllabi6th = \[\n.*?\];', 
    new_syllabi6th, 
    text, 
    flags=re.DOTALL
)

# Update default semester to 6th
text = text.replace("useState('5th')", "useState('6th')")

with open('src/pages/Syllabus.jsx', 'w') as f:
    f.write(text)

print("Syllabus updated!")
