const buildPermissionsPills = (items = []) => items.map(p => `<code class="x-permissions__pill">${p}</code>`).join('');

const buildPermissionsBadge = (perms) => {
  const badge = document.createElement('div');
  badge.className = 'x-permissions';
  const hasAllPills = buildPermissionsPills(perms.hasAll);
  const hasAnyPills = buildPermissionsPills(perms.hasAny);
  const hasAnyContent = hasAnyPills ? ` any of: (${hasAnyPills})` : '';
  const line = document.createElement('span');
  line.className = 'x-permissions__line';
  line.innerHTML = `<span class="x-permissions__label">Permissions - </span>${hasAllPills}${hasAnyContent}`;
  badge.appendChild(line);
  return badge;
};

const buildSinceBadge = (version) => {
  const badge = document.createElement('div');
  badge.className = 'x-since';
  badge.textContent = `Added in ${version}`;
  return badge;
};

const XExtensionsPlugin = () => ({
  wrapComponents: {
    operation: (Original, system) => (props) => {
      const h = system.React.createElement;
      const op = props.operation.get('op');
      const perms = op.get?.('x-permissions')?.toJS();
      const since = op.get?.('x-since');

      if (!perms && !since) {
        return h(Original, props);
      }

      const ref = (node) => {
        const descWrapper = node?.querySelector('.opblock-description-wrapper');
        if (!descWrapper || descWrapper.querySelector('.x-extensions')) {
          return;
        }

        const container = document.createElement('div');
        container.className = 'x-extensions';
        if (since) {
          container.appendChild(buildSinceBadge(since));
        }
        if (perms) {
          container.appendChild(buildPermissionsBadge(perms));
        }
        descWrapper.prepend(container);
      };

      return h('div', { ref }, h(Original, props));
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  SwaggerUIBundle({
    dom_id: '#swagger-ui',
    url: 'https://gist.githubusercontent.com/jkuester/a738de6aa6f96e5957b1f4ce56a3692a/raw/openapi.json',
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [XExtensionsPlugin],
    filter: true,
    operationsSorter: 'alpha',
    tagsSorter: 'alpha',
    docExpansion: 'none',
    deepLinking: true,
    supportedSubmitMethods: [],
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 3
  });
});
