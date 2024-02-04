precision mediump float;

uniform vec2 uMouse;
uniform vec2 uRes;

varying vec3 vPos;
varying vec3 vNormal;

void main() {
	// float dist = abs(gl_FragCoord.y - uMouse.y) + abs (gl_FragCoord.x - uMouse.x);
	// float distWithOffset = dist - 50.0;

	// gl_FragColor = vec4(vec3(1.0), 1.0 * distWithOffset);
	// gl_FragColor = vec4(vec3(1.0), 1.0 * abs(uRes.xy / 2.0 - gl_FragCoord.xy) - 50.0);
	gl_FragColor = vec4(vNormal.yyy, 1);
}