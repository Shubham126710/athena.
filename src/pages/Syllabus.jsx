import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, Search } from 'lucide-react';
import HubNavbar from '../components/HubNavbar.jsx';

export default function SyllabusPage() {
  const nav = useNavigate();
  const [expandedSubject, setExpandedSubject] = React.useState(null);
  const [expandedUnit, setExpandedUnit] = React.useState(null);
  const [semester, setSemester] = React.useState('6th');

    const syllabi6th = [
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
  ];
  const syllabi5th = [
    {
      subject: 'Computer Networks', abbr:'CN', code:'23CST-335', units:[
        { id:1, title:'Introduction to Computer Networks', hours:15, topics:[
          'Overview of Computer Networks and Distributed Systems',
          'Classification of Computer Networks: PAN, LAN, MAN, WAN',
          'Layered Network Structures: OSI and TCP/IP Models',
          'Data Communication Components: Sender, Receiver, Medium, Message, Protocol',
          'Representation of Data and its Flow (analog, digital)',
          'Network Topologies: Bus, Star, Ring, Mesh, Hybrid',
          'Protocols and Standards: Importance and Examples (IEEE, ITU, ISO)',
          'OSI Model: Layer-wise Functions and Real-World Mapping',
          'Transmission Media: Guided (Twisted Pair, Coaxial, Optical Fiber), Unguided (Radio, Microwave, Infrared)',
          'Wired LANs: Ethernet, IEEE 802.3 Standards',
          'Wireless LANs: IEEE 802.11 Standards, Access Points',
          'Virtual LANs: Definition, VLAN Tagging, Benefits'
        ]},
        { id:2, title:'Bandwidth Utilization and Protocols in Data Link & Network Layer', hours:15, topics:[
          'Frequency Division Multiplexing (FDM)',
          'Time Division Multiplexing (TDM)',
          'Wave Division Multiplexing (WDM)',
          'Spread Spectrum Techniques: DSSS, FHSS',
          'Error Detection and Correction: Parity, Block Coding, Hamming Code, CRC',
          'Flow Control: Stop-and-Wait, Sliding Window Protocol',
          'Error Control Protocols: Go-Back-N, Selective Repeat ARQ, Piggybacking',
          'Medium Access Protocols: ALOHA (Pure, Slotted), CSMA/CD, CSMA/CA',
          'Network Layer Introduction: Functions and Responsibilities',
          'Switching Techniques: Circuit, Message, Packet Switching',
          'Logical Addressing: IPv4 Addressing, Subnetting, IPv6 Overview',
          'Address Mapping: ARP, RARP, BOOTP, DHCP',
          'Packet Delivery and Forwarding: Direct vs Indirect Delivery',
          'Unicast Routing Protocols: RIP, OSPF, BGP'
        ]},
        { id:3, title:'Protocols in Transport & Application Layer, and Network Security', hours:15, topics:[
          'Process-to-Process Communication',
          'UDP: Format, Characteristics, Use Cases',
          'TCP: Connection Establishment, Congestion Control, Features',
          'SCTP: Multi-homing, Multi-streaming, Congestion Control',
          'QoS Concepts: Throughput, Latency, Jitter, Bandwidth',
          'QoS Techniques: Leaky Bucket, Token Bucket Algorithms',
          'Application Layer Protocols: DNS, DDNS, TELNET, EMAIL, FTP, WWW, HTTP, SNMP',
          'Bluetooth and Firewalls: Basics and Functions',
          'Network Security Overview: Threats, Goals (CIA)',
          'Electronic Mail Security: PGP, S/MIME',
          'Directory Services and Network Management Overview',
          'Basic Cryptography: Symmetric, Asymmetric Encryption'
        ]}
      ]
    },
    { subject:'Formal Languages & Automata Theory', abbr:'FLAT', code:'23CST-334', units:[
      { id:1, title:'Finite State Machines And Regular Languages', hours:15, topics:[
        'Basic Mathematics',
        'Introduction to formal language, Basic Terminology: Alphabet, Formal Language, Operations on formal languages',
        'Finite State Machines: Properties and Limitations',
        'Deterministic Finite Automata(DFA)',
        'Non-Deterministic Finite Automata (NFA)',
        'Equivalence of DFA and NDFA',
        'Regular Languages and Regular Expressions',
        'Properties of regular languages',
        'Kleene\'s theorem',
        'Pumping lemma for regular languages'
      ]},
      { id:2, title:'Context Free Grammar, Languages and Pushdown automata', hours:15, topics:[
        'Context-free grammar and language',
        'DESIGNING CONTEXT-FREE GRAMMARS and Parse trees',
        'Ambiguity',
        'Chomsky\'s Normal form',
        'THE PUMPING LEMMA FOR CONTEXT-FREE LANGUAGES',
        'Introduction to Pushdown Automaton (PDA)',
        'PDA CONFIGURATIONS',
        'ACCEPTANCE NOTIONS FOR PDAS',
        'TRANSITION DIAGRAMS FOR PDAS',
        'Equivalence between PDA and CFG',
        'Closure properties of CFL and Relation between CFL and Regular language',
        'Context-sensitive grammars (CSG) and languages',
        'Linear bound automata (LBA) and equivalence with CSG'
      ]},
      { id:3, title:'Turing machine and Complexity theory', hours:15, topics:[
        'Introduction to Turing machines',
        'Multitape Turing machines',
        'Equivalence with Single tape TM and Turing Recognizable languages',
        'Nondeterministic Turing machines, equivalence with deterministic TM and Turing-recognizability based on NDTM',
        'Enumerator and enumerability',
        'Properties of Recursive and Recursively-enumerable languages',
        'THE DEFINITION OF ALGORITHM and CHURCH TURING THESIS',
        'Decidability and undecidability',
        'Chomsky\'s Hierarchy',
        'Reducibility',
        'Introduction to Complexity theory and complexity classes'
      ]}
    ]},
    { subject:'Foundations of Machine Learning', abbr:'FML', code:'23CSH-338', units:[
      { id:1, title:'Introduction to Machine Learning', hours:15, topics:[
        'Definition and Classification of Machine Learning algorithms',
        'Supervised Learning, Unsupervised Learning, Reinforcement Learning, Semi-Supervised Learning',
        'Applications of Machine Learning',
        'Handling Missing data',
        'Encoding Categorical data',
        'Feature Scaling',
        'Handling Time Series data',
        'Feature Selection techniques',
        'Data Transformation',
        'Normalization',
        'Dimensionality reduction',
        'Data Frame Basics',
        'Different types of plots',
        'Plotting fundamentals using Matplotlib',
        'Plotting fundamentals using Seaborn'
      ]},
      { id:2, title:'Supervised Learning', hours:15, topics:[
        'Linear regression',
        'Ridge Regression',
        'Lasso Regression',
        'Bayesian Linear Regression',
        'Types of Classification Algorithm: Binary Classification and Multi-Class Classification',
        'Logistic Regression',
        'K-Nearest Neighbours',
        'Decision Trees',
        'Random Forest',
        'Support Vector Machine',
        'Performance metrics for Regression: Mean Absolute Error, Mean Squared Error, Root Mean Squared Error, R-Squared',
        'Performance metrics for classification: Confusion Matrix, Accuracy, Precision, Recall, F1 score'
      ]},
      { id:3, title:'Unsupervised Learning', hours:15, topics:[
        'Types of Clustering: Centroid-based clustering, Density-based clustering, Distribution-based Clustering and Hierarchical clustering',
        'K- Means Clustering',
        'KNN (K-Nearest Neighbours)',
        'DBSCAN clustering algorithm',
        'Performance metrics for clustering: Silhouette Score',
        'Apriori algorithm',
        'F-P Growth Algorithm',
        'Applications of Association Rule Learning',
        'Market Basket Analysis',
        'Types of Reinforcement learning',
        'Key Features of Reinforcement Learning',
        'Elements of Reinforcement Learning',
        'Applications of Reinforcement Learning'
      ]}
    ]},
    { subject:'Predictive Analytics', abbr:'PA', code:'23CSH-335', units:[
      { id:1, title:'Data Mining Concepts and Handling Data', hours:15, topics:[
        'INTRODUCTION TO DATA MINING: Data-Mining Application, A strategy for Data Mining: CRISP-DM, Stages and Tasks in CRISP-DM, Life Cycle of a Data-Mining Project, Skills Needed for Data Mining',
        'WORKING WITH MODELER: Introducing Nodes and Streams, Explore the user Interface, Creating Streams-General Rules, Placing Nodes, Managing Nodes, Managing Connections, Encapsulating Nodes in a super Node, Generating Nodes from Output, Running Streams',
        'COLLECTING INITIAL DATA: Rectangular Data Structure, The Unit Analysis, Field Storages, Field Measurement Levels, Storage and Measurement level, Fields Instantiation, Importing Data, The Sources Dialog Boxes- Data Tab, Importing Text Files, Exporting data',
        'UNDERSTANDING YOUR DATA: Data Audit, Using Statistics Node and Graphs Nodes for Reporting, Describe Types of Invalid Values, Action for Invalid Values, Dealing with Missing Data, Reporting Blanks in a Data Audit',
        'SETTING THE UNIT OF ANALYSIS: The Required Unit of Analysis, Methods to create datasets with the required unit of analysis, Distincting Records, Aggregating Records, Setting to Flag Fields',
        'A DATA-MINING TOUR: The Basic framework of a Data-Mining Projects, Business Case, A Predictive Model, Deploying the Model, A Data-Mining project in Modeler, Building the Model-Setting roles in Type Node, Score Records, Filter and Sort',
        'INTRODUCTION TO MODELLING: Modelling Objectives, Objectives And Roles In The Type Node, Types Of Classification Models, Rule Induction Models, Traditional Statistical Models, Machine Learning Models, Running Classification Models, Modelling Results: The Model Nugget, Evaluating Classification Models, Applying Classification Models, Segmentation Models, Running Segmentation Models, Examining The Results: Cluster Profiles'
      ]},
      { id:2, title:'Basics of Computing', hours:15, topics:[
        'DERIVING AND RECLASSIFYING FIELDS: Methods To Create Fields, Introducing The Control Language For Expression Manipulation (Clem), Deriving fields And Blanks, Reclassifying Fields, Checking Your Results',
        'LOOKING FOR RELATIONSHIPS: Methods To Examine The Relationship Between Two Fields, Explore Matrix Output, Distribution Output, Means Output, Histogram Output, Statistics Output, Plot Output',
        'Using Date And Time Functions, Using Conversion Functions, Using String Functions, Using Statistical Functions, Using Missing Value Functions',
        'DATA TRANSFORMATIONS: Selecting A Method To Transform Data, Filling Fields, Binning Fields, Data Transformations',
        'WORKING WITH SEQUENCE DATA: Sequence Data, Using Cross-Record Functions, Deriving A Counter Field, Deriving A Counter Field, Restructuring Data, Using Geospatial and Time Data',
        'SAMPLING RECORDS: Selecting A Sampling Method, Selecting A Simple Sampling Method, Selecting A Complex Sampling Method, Using Partitioning, Balancing Record',
        'IMPROVING EFFICIENCY: Using Sql Pushback, Previewing Sql, Identifying A-Typical Values, Processing Missing Values, Imputing Missing Values, Using Globals, Using Parameters, Using Conditional Execution and Looping'
      ]},
      { id:3, title:'Advanced Theories', hours:15, topics:[
        'AUTOMATED DATA MINING: The basics of using a modeler, adding nodes and creating streams in the modeler, Reading data files, Data exploration, Automated data preparation, Data partitioning, Predictor selection for modelling, Automated models for categorical targets, Model evaluation, Automated models for continuous targets, Deploying models'
      ]}
    ]}
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <HubNavbar />

      <main className="pt-32 pb-12 px-6 md:px-12 container mx-auto">
                <div className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Syllabus</h1>
              <p className="text-neutral-400">Track your curriculum progress and topics.</p>
            </div>
            <select value={semester} onChange={e => setSemester(e.target.value)} className="px-4 py-2 border border-neutral-800 bg-neutral-900 text-white rounded">
              <option value="5th">5th Semester</option>
              <option value="6th">6th Semester</option>
            </select>
        </div>

        <div className="space-y-6">
            {(semester === '5th' ? syllabi5th : syllabi6th).map((subject, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                    <div 
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-colors"
                        onClick={() => setExpandedSubject(expandedSubject === idx ? null : idx)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white rounded-lg grid place-items-center font-bold text-lg">
                                {subject.abbr}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{subject.subject}</h2>
                                <p className="text-sm text-neutral-500 font-mono">{subject.code}</p>
                            </div>
                        </div>
                        {expandedSubject === idx ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    {expandedSubject === idx && (
                        <div className="border-t border-neutral-800 bg-neutral-950/30">
                            {subject.units.map((unit, uIdx) => (
                                <div key={uIdx} className="border-b border-neutral-800 last:border-0">
                                    <div 
                                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-colors"
                                        onClick={() => setExpandedUnit(expandedUnit === `${idx}-${uIdx}` ? null : `${idx}-${uIdx}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold bg-neutral-800 px-2 py-1 rounded text-neutral-300">UNIT {unit.id}</span>
                                            <span className="font-medium text-neutral-200">{unit.title}</span>
                                        </div>
                                        {expandedUnit === `${idx}-${uIdx}` ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                                    </div>
                                    
                                    {expandedUnit === `${idx}-${uIdx}` && (
                                        <div className="px-6 pb-6 pt-2 pl-14">
                                            <ul className="space-y-2">
                                                {unit.topics.map((topic, tIdx) => (
                                                    <li key={tIdx} className="text-sm text-neutral-400 flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full mt-1.5 flex-shrink-0"></div>
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
