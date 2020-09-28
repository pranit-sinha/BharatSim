import { contentTypes } from '../constants/fetch';
import { url as serviceURL } from './url';
import { fetchData, uploadData } from './fetch';

function headerBuilder({ contentType }) {
  return {
    'content-type': contentType,
  };
}

function formDataBuilder(data) {
  const formData = new FormData();
  data.forEach(({ name, value }) => formData.append(name, value));
  return formData;
}

const api = {
  saveDashboard: async ({ widgets, layout, dashboardId, name, count }) => {
    return uploadData({
      url: serviceURL.DASHBOARD_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({
        dashboardData: { widgets, layout, dashboardId, name, count },
      }),
    });
  },

  getAllDashBoard: async () => fetchData({ url: serviceURL.DASHBOARD_URL }),

  uploadFileAndSchema: async (file, schema) =>
    uploadData({
      url: serviceURL.DATA_SOURCES,
      data: formDataBuilder([
        { name: 'datafile', value: file },
        { name: 'schema', value: JSON.stringify(schema) },
      ]),
      headers: headerBuilder({ contentType: contentTypes.FILE }),
    }),

  getCsvHeaders: async ({ data }) => fetchData({ url: serviceURL.getHeaderUrl(data) }),

  getDatasources: async () => fetchData({ url: serviceURL.DATA_SOURCES }),

  getData: async ({ params: datasource, query }) =>
    fetchData({ url: serviceURL.getDataUrl(datasource), query }),

  createNewProject: async () => {
    return uploadData({
      url: serviceURL.PROJECT_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({ projectData: { name: 'untitled project' } }),
    });
  },
  getProjects: async () => {
    return fetchData({
      url: serviceURL.PROJECT_URL,
    });
  },
  getProject: async (id) => {
    return fetchData({
      url: serviceURL.getProjectUrl(id),
    });
  },
};

export { api };
