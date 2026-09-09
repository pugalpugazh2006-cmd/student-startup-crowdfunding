const API_BASE_URL = 'https://student-startup-crowdfunding-production.up.railway.app/api/pitches';

// --- Formatters ---
const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

// --- Load Campaigns (index.html) ---
async function loadCampaigns() {
    try {
        const response = await fetch(API_BASE_URL);
        const pitches = await response.json();
        const container = document.getElementById('campaigns-container');

        if (pitches.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No campaigns found. Be the first to start one!</p>';
            return;
        }

        container.innerHTML = pitches.map(pitch => {
            const progress = pitch.targetAmount > 0 ? Math.min((pitch.currentAmount / pitch.targetAmount) * 100, 100) : 0;
            return `
                <div class="glass-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <span class="badge ${pitch.status === 'COMPLETED' ? 'badge-completed' : 'badge-active'}">${pitch.status}</span>
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">${formatDate(pitch.creationDate)}</span>
                    </div>
                    <h3>${pitch.title}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">by ${pitch.founderName}</p>
                    <p style="margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${pitch.problemStatement}</p>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 500;">
                            <span>${formatCurrency(pitch.currentAmount)} raised</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); text-align: right; margin-bottom: 1.5rem;">
                            Target: ${formatCurrency(pitch.targetAmount)}
                        </div>
                    </div>
                    
                    <a href="campaign-details.html?id=${pitch.id}" class="btn-outline" style="display: block; text-align: center; padding: 0.5rem; border-radius: 0.5rem; text-decoration: none;">View Campaign</a>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Error loading campaigns:", error);
        const container = document.getElementById('campaigns-container');
        if (container) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--danger); padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem;"><strong>Cannot connect to the server.</strong><br><br>Please make sure your Spring Boot backend and MySQL database are running!</p>';
        }
    }
}

// --- Create Campaign Form (create-campaign.html) ---
const createForm = document.getElementById('create-pitch-form');
if (createForm) {
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            founderName: document.getElementById('founderName').value,
            title: document.getElementById('title').value,
            problemStatement: document.getElementById('problemStatement').value,
            solutionDescription: document.getElementById('solutionDescription').value,
            videoUrl: document.getElementById('videoUrl').value,
            targetAmount: parseFloat(document.getElementById('targetAmount').value)
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Campaign created successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Error creating campaign. Please check the inputs.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Failed to connect to the server.');
        }
    });
}

// --- Load Campaign Details (campaign-details.html) ---
async function loadCampaignDetails(id) {
    try {
        const [pitchRes, pledgesRes, milestonesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/${id}`),
            fetch(`${API_BASE_URL}/${id}/pledges`),
            fetch(`${API_BASE_URL}/${id}/milestones`)
        ]);

        if (!pitchRes.ok) {
            document.getElementById('campaign-details').innerHTML = '<p>Campaign not found.</p>';
            return;
        }

        const pitch = await pitchRes.json();
        const pledges = await pledgesRes.json();
        const milestones = await milestonesRes.json();

        const progress = pitch.targetAmount > 0 ? Math.min((pitch.currentAmount / pitch.targetAmount) * 100, 100) : 0;

        let videoEmbed = '';
        if (pitch.videoUrl) {
            // Very simple video URL handling (best effort for YouTube)
            let embedUrl = pitch.videoUrl;
            if (pitch.videoUrl.includes('youtube.com/watch?v=')) {
                embedUrl = pitch.videoUrl.replace('watch?v=', 'embed/');
            }
            videoEmbed = `<div style="margin: 2rem 0; border-radius: 1rem; overflow: hidden;"><iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div>`;
        }

        const html = `
            <div class="campaign-layout">
                <!-- Main Content -->
                <div>
                    <span class="badge ${pitch.status === 'COMPLETED' ? 'badge-completed' : 'badge-active'}">${pitch.status}</span>
                    <h1 style="margin-top: 1rem; font-size: 2.5rem;">${pitch.title}</h1>
                    <p style="color: var(--text-secondary); font-size: 1.1rem;">by ${pitch.founderName} • Launched on ${formatDate(pitch.creationDate)}</p>
                    
                    ${videoEmbed}

                    <div class="glass-card" style="margin-top: 2rem;">
                        <h3>The Problem</h3>
                        <p style="white-space: pre-wrap;">${pitch.problemStatement}</p>
                        <h3 style="margin-top: 2rem;">The Solution</h3>
                        <p style="white-space: pre-wrap;">${pitch.solutionDescription}</p>
                    </div>

                    <div class="glass-card" style="margin-top: 2rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h3>Project Milestones</h3>
                            <button onclick="toggleMilestoneForm()" class="btn-outline" style="padding: 0.25rem 0.75rem; border-radius: 0.5rem; border: 1px solid var(--text-secondary); color: var(--text-secondary); background: transparent; cursor: pointer;">+ Add Update</button>
                        </div>
                        
                        <form id="milestone-form" style="display: none; margin-bottom: 2rem; background: var(--bg-primary); padding: 1.5rem; border-radius: 0.5rem;">
                            <div class="form-group">
                                <label>Milestone Title</label>
                                <input type="text" id="m-title" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="m-desc" class="form-control" rows="2" required></textarea>
                            </div>
                            <button type="submit" class="btn" style="padding: 0.5rem 1rem;">Post Update</button>
                        </form>

                        <div class="milestone-timeline">
                            ${milestones.length === 0 ? '<p style="color: var(--text-secondary);">No milestones reported yet.</p>' : ''}
                            ${milestones.map(m => `
                                <div class="milestone-item">
                                    <h4 style="color: var(--text-primary);">${m.title}</h4>
                                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${formatDate(m.milestoneDate)}</span>
                                    <p style="margin-top: 0.5rem; color: var(--text-secondary);">${m.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Sidebar (Funding & Pledges) -->
                <div>
                    <div class="glass-card sticky-sidebar" style="position: sticky; top: 100px;">
                        <h2 class="text-gradient" style="font-size: 2.5rem; margin-bottom: 0;">${formatCurrency(pitch.currentAmount)}</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">pledged of ${formatCurrency(pitch.targetAmount)} goal</p>
                        
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-weight: 500;">
                            <span>${pledges.length} backers</span>
                            <span>${Math.round(progress)}% funded</span>
                        </div>

                        ${pitch.status !== 'COMPLETED' ? `
                            <form id="pledge-form" style="background: var(--bg-primary); padding: 1.5rem; border-radius: 0.5rem;">
                                <h4 style="margin-bottom: 1rem;">Make a simulated pledge</h4>
                                <div class="form-group">
                                    <input type="text" id="p-name" class="form-control" placeholder="Your Name" required>
                                </div>
                                <div class="form-group">
                                    <input type="email" id="p-email" class="form-control" placeholder="Your Email" required>
                                </div>
                                <div class="form-group">
                                    <div style="position: relative;">
                                        <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary);">₹</span>
                                        <input type="number" id="p-amount" class="form-control" placeholder="Amount" style="padding-left: 2rem;" required min="10">
                                    </div>
                                </div>
                                <button type="submit" class="btn" style="width: 100%;">Pledge Support</button>
                            </form>
                        ` : `
                            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); color: var(--success); padding: 1rem; border-radius: 0.5rem; text-align: center; font-weight: 500;">
                                🎉 This campaign has reached its funding goal!
                            </div>
                        `}

                        <h3 style="margin-top: 2rem; margin-bottom: 1rem; font-size: 1.2rem;">Backer Wall</h3>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${pledges.length === 0 ? '<p style="color: var(--text-secondary); font-size: 0.9rem;">Be the first to back this project!</p>' : ''}
                            ${pledges.map(p => `
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--glass-border); font-size: 0.9rem;">
                                    <span style="font-weight: 500;">${p.backerName}</span>
                                    <span style="color: var(--accent-primary); font-weight: 700;">${formatCurrency(p.amount)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('campaign-details').innerHTML = html;

        // Attach pledge handler
        const pledgeForm = document.getElementById('pledge-form');
        if (pledgeForm) {
            pledgeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await submitPledge(id);
            });
        }

        // Attach milestone handler
        const milestoneForm = document.getElementById('milestone-form');
        if (milestoneForm) {
            milestoneForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await submitMilestone(id);
            });
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

async function submitPledge(pitchId) {
    const payload = {
        backerName: document.getElementById('p-name').value,
        backerEmail: document.getElementById('p-email').value,
        amount: parseFloat(document.getElementById('p-amount').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${pitchId}/pledges`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Pledge successful! Thank you for your support.');
            location.reload(); // Reload to show updated progress
        } else {
            alert('Error processing pledge.');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function toggleMilestoneForm() {
    const form = document.getElementById('milestone-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function submitMilestone(pitchId) {
    const payload = {
        title: document.getElementById('m-title').value,
        description: document.getElementById('m-desc').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${pitchId}/milestones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            location.reload();
        } else {
            alert('Error adding milestone.');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// --- Load Admin Dashboard (admin.html) ---
async function loadAdminDashboard() {
    try {
        const response = await fetch(API_BASE_URL);
        const pitches = await response.json();
        const tbody = document.getElementById('admin-table-body');

        if (pitches.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No campaigns found.</td></tr>';
            return;
        }

        tbody.innerHTML = pitches.map(pitch => `
            <tr>
                <td style="color: var(--text-secondary);">#${pitch.id}</td>
                <td style="font-weight: 500;">
                    <a href="campaign-details.html?id=${pitch.id}" style="color: var(--text-primary); text-decoration: none;">${pitch.title}</a>
                </td>
                <td>${pitch.founderName}</td>
                <td>${formatCurrency(pitch.targetAmount)}</td>
                <td style="color: var(--accent-primary); font-weight: 500;">${formatCurrency(pitch.currentAmount)}</td>
                <td><span class="badge ${pitch.status === 'COMPLETED' ? 'badge-completed' : 'badge-active'}">${pitch.status}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Error:", error);
    }
}
