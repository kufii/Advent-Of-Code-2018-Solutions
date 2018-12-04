import m from 'https://gitcdn.link/cdn/MithrilJS/mithril.js/next/mithril.mjs';

export default () => {
	return {
		view: ({ attrs: { options, onselect, selected } }) =>
			m(
				'select',
				{
					onchange: ({ target: t }) => onselect(t.options[t.selectedIndex].value)
				},
				options.map(
					opt =>
						m(
							'option',
							{
								value: (typeof opt.value === 'undefined' ? opt : opt.value).toString(),
								selected: (typeof opt.value === 'undefined' ? opt : opt.value).toString() === selected.toString()
							},
							opt.text || opt
						)
				)
			)
	};
};
