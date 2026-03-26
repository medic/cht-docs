const buildPermissionPill = (text) => {
  const pill = document.createElement('code');
  pill.className = 'x-permissions__pill';
  pill.textContent = text;
  return pill;
};

const buildPermissionsBadge = (perms) => {
  const badge = document.createElement('div');
  badge.className = 'x-permissions';
  const line = document.createElement('span');
  line.className = 'x-permissions__line';

  const label = document.createElement('span');
  label.className = 'x-permissions__label';
  label.textContent = 'Permissions - ';
  line.appendChild(label);

  (perms.hasAll || []).forEach(p => line.appendChild(buildPermissionPill(p)));

  if (perms.hasAny?.length) {
    line.appendChild(document.createTextNode(' any of: ('));
    perms.hasAny.forEach(p => line.appendChild(buildPermissionPill(p)));
    line.appendChild(document.createTextNode(')'));
  }

  badge.appendChild(line);
  return badge;
};

const buildSinceBadge = (version) => {
  const badge = document.createElement('div');
  badge.className = 'x-since';
  badge.textContent = `Added in ${version}`;
  return badge;
};

const extendDescriptionBlock = (perms, since) => (node) => {
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

      return h('div', { ref: extendDescriptionBlock(perms, since) }, h(Original, props));
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  SwaggerUIBundle({
    dom_id: '#swagger-ui',
    // TODO Update
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
