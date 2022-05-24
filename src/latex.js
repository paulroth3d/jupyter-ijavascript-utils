/* eslint-disable no-unused-vars */

const IJSUtils = require('./ijs');
const HtmlScriptInternal = require('./htmlScript_internal');

/**
 * Renders LaTeX or KaTeX within a jupyter notebook cell.
 * 
 * [LaTeX](https://www.latex-project.org/) is a typesetting engine often used for writing mathematical formulas
 * along with technical and scientific documentation. ({@link module:latex.render|see latex.render()})
 * 
 * [KaTeX](https://katex.org/) is a very fast typesetting library specifically to write math notation.
 * It implements a subset of the LaTeX specification. ({@link module:latex.katex|see latex.katex()})
 * <a id="note-on-backslashes" >&nbsp;</a>
 * # Note on Backslashes
 * 
 * Both LaTeX and KaTeX use slashed characters that are not normally understood by JavaScript strings.
 * 
 * For example: `"c = \pm\sqrt{a^2 + b^2}"`
 * 
 * An alternative to using additional backslashes is possible: `c = \\pm\\sqrt{a^2 + b^2}`
 * 
 * However, use of [String.raw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)
 * may be easier.
 * 
 * (Please note though, that some sequences still need to be escaped, such as: `${`, `\n`, `\x` 
 * 
 * For example:
 * 
 * ```
 * utils.latex.render(String.raw`Given : $\pi = 3.14$ , $\alpha = \frac{3\pi}{4}\, rad$
 * $$
 * \omega = 2\pi f \\
 * f = \frac{c}{\lambda}\\
 * \lambda_0=\theta^2+\delta\\
 * \Delta\lambda = \frac{1}{\lambda^2}
 * $$`);
 * ```
 * 
 * Renders as:
 * 
 * ![Screenshot of Latex](img/latexExample.png)
 * 
 * Learn more about how to write LaTeX in the
 * [Toward Data Science article here](https://towardsdatascience.com/write-markdown-latex-in-the-jupyter-notebook-10985edb91fd#4cd2)
 * 
 * Or in the [Illinois University document here](https://faculty.math.illinois.edu/~hildebr/tex/course/intro2.html)
 * 
 * @module latex
 * @exports latex
 */
module.exports = {};
const KatexUtils = module.exports;

/**
 * Renders the body text as LaTeX using the
 * [Jupyter Lab supported mime-type](https://jupyterlab.readthedocs.io/en/2.2.x/user/file_formats.html#latex):
 * `text/latex`.
 * 
 * **See the note the [Note on Backslashes](#note-on-backslashes) above.**
 * 
 * For example:
 * 
 * ```
 * utils.latex.render(String.raw`Given : $\pi = 3.14$ , $\alpha = \frac{3\pi}{4}\, rad$
 * $$
 * \omega = 2\pi f \\
 * f = \frac{c}{\lambda}\\
 * \lambda_0=\theta^2+\delta\\
 * \Delta\lambda = \frac{1}{\lambda^2}
 * $$`);
 * ```
 * 
 * ![Screenshot of Latex](img/latexExample.png)
 * 
 * @param {String} body 
 */
module.exports.render = function render(body) {
  const context = IJSUtils.detectContext();
  if (!context) throw Error('latex.render: expected to be run within the iJavaScript context');
  const { $$: display } = context;

  display.mime({ 'text/latex': body });
};

/**
 * Renders a KaTeX math expression through {@link module:ijs.htmlScript|ijs.htmlScript} in the Browser.
 * 
 * It is a [subset of LaTeX - see here for supported functions](https://katex.org/docs/support_table.html)
 * that focuses primarily on Math representation.
 * 
 * While not supported out of the box, it does provide a number of very nice features and options not supported
 * by standalone LaTeX.
 * 
 * For example, here we can give options on display options, and additional custom macros.
 * 
 * ```
 * utils.latex.katex("c = \\pm\\root{a^2 + b^2}\\in\\RR", {
 *     displayMode: false,
 *     macros: {
 *       "\\RR": "\\mathbb{R}",
 *       "\\root": "\\sqrt"
 *     }
 * });
 * ```
 * 
 * ![Screenshot of KaTeX with Options](img/katexOptionsExample.png)
 * 
 * **See the note the [Note on Backslashes](#note-on-backslashes) above.**
 * 
 * (As this runs within htmlScript, and not within latex, it may not be preserved in all output formats)
 * 
 * @param {String} expression - KaTeX expression to render (note comment on String.raw)
 * @param {Object} katexRenderOptions - Options object to pass to katex.render
 * @param {Object} htmlScriptOptions - Options to pass to the htmlScript renderer.
 * 
 * @see {@link https://katex.org/docs/support_table.html|KaTeX documentation}
 */
module.exports.katex = function katex(expression, katexRenderOptions = null, options = null) {
  const cleanOptions = !options ? {} : options;
  const cleanKatexOptions = !katexRenderOptions ? {} : katexRenderOptions;

  const katexOptions = {
    throwOnError: false,
    ...cleanKatexOptions
  };

  IJSUtils.htmlScript({
    ...cleanOptions,
    scripts: [
      'https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js'
    ],
    css: ['https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css'],
    data: { expression, katexOptions },
    height: '100%',
    onReady: HtmlScriptInternal.katexRenderOnReady
  });
};
