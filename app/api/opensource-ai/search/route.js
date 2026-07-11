import { NextResponse } from 'next/server';
import { searchProjects, getProjectsByCategory, getCategories } from '../../../../lib/opensource-ai';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const role = searchParams.get('role') || 'viewer';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (query.trim()) {
      const results = searchProjects(query, role);
      const start = (page - 1) * limit;
      const paginated = results.slice(start, start + limit);
      
      return NextResponse.json({
        success: true,
        results: paginated,
        total: results.length,
        page,
        totalPages: Math.ceil(results.length / limit),
      });
    }

    if (category !== 'all') {
      const grouped = getProjectsByCategory(role);
      const catProjects = grouped[category] || {};
      let allProjects = [];
      for (const [subcat, projects] of Object.entries(catProjects)) {
        allProjects = allProjects.concat(projects);
      }
      
      const start = (page - 1) * limit;
      const paginated = allProjects.slice(start, start + limit);
      
      return NextResponse.json({
        success: true,
        results: paginated,
        subcategories: catProjects,
        total: allProjects.length,
        page,
        totalPages: Math.ceil(allProjects.length / limit),
      });
    }

    // Return categories overview
    const categories = getCategories(role);
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('OpenSource AI search error:', error);
    return NextResponse.json(
      { error: 'Failed to search projects' },
      { status: 500 }
    );
  }
}
