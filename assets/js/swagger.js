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

/**
 * Plugin to display x-permissions and x-since extensions in the operation description block.
 *
 * It looks for x-permissions and x-since extensions on the operation object, and if found, it adds badges to the
 * description block of the operation. The x-permissions extension is expected to have a structure like this:
 * {
 *   "x-permissions": {
 *     "hasAll": ["perm1", "perm2"],
 *     "hasAny": ["perm3", "perm4"]
 *   }
 * }
 * The x-since extension is expected to be a string with the version since which the operation is available, e.g.:
 * {
 *   "x-since": "v1.2.3"
 * }
 * @constructor
 */
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

/**
 * Plugin to add an offset to the scroll position when clicking on a deep link, to account for the fixed navigation bar.
 *
 * Note that this has a known issue where it does not fully scroll for deep links at the very bottom of the page. This
 * is because there is a delay in Swagger rendering the content for the selected operation. So the browser only
 * scrolls to what it thinks is the very bottom of the page (before Swagger adds more content). To address this, we
 * would need to somehow wait for the content to be rendered before scrolling, but there is no hook for this in Swagger.
 * So for now, we accept this minor issue.
 * @constructor
 */
const ScrollOffsetPlugin = () => ({
  statePlugins: {
    layout: {
      wrapActions: {
        scrollToElement: () => ref => {
          const offset = document.querySelector('nav')?.offsetHeight || 0;
          const top = ref.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  }
});

// Sync Hextra's .dark class to Swagger UI's expected .dark-mode class
const syncDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode', document.documentElement.classList.contains('dark'));
};
syncDarkMode();
new MutationObserver(syncDarkMode).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

window.addEventListener('DOMContentLoaded', () => {
  SwaggerUIBundle({
    dom_id: '#swagger-ui',
    // TODO Update
    url: 'https://gist.githubusercontent.com/jkuester/a738de6aa6f96e5957b1f4ce56a3692a/raw/openapi.json',
    presets: [SwaggerUIBundle.presets.apis],
    plugins: [XExtensionsPlugin, ScrollOffsetPlugin],
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
