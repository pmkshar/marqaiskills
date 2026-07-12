import { NextResponse } from 'next/server';
import { searchProjects, getProjectsByCategory, getCategories, getCapabilityCounts } from '../../../../lib/ai-directory';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const capability = searchParams.get('capability') || 'all';
    const role = searchParams.get('role') || 'viewer';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let results = [];

    if (query.trim()) {
      results = searchProjects(query, role);
    } else if (category !== 'all') {
      const grouped = getProjectsByCategory(role);
      const catProjects = grouped[category] || {};
      for (const [subcat, projects] of Object.entries(catProjects)) {
        results = results.concat(projects);
      }
    } else {
      // Return all accessible projects
      results = searchProjects('', role);
    }

    // Filter by capability
    if (capability !== 'all') {
      results = results.filter(p => 
        p.capabilities && p.capabilities.includes(capability)
      );
    }

    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    const response = {
      success: true,
      results: paginated,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit),
    };

    // Include capability counts on first page with no filters
    if (page === 1 && category === 'all' && !query.trim() && capability === 'all') {
      response.capabilityCounts = getCapabilityCounts(role);
    }

    if (category !== 'all' && !query.trim()) {
      const grouped = getProjectsByCategory(role);
      response.subcategories = grouped[category] || {};
    }

    if (category === 'all' && !query.trim()) {
      const categories = getCategories(role);
      response.categories = categories;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Directory search error:', error);
    return NextResponse.json(
      { error: 'Failed to search projects' },
      { status: 500 }
    );
  }
}
