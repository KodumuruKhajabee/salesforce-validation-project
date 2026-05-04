/**
 * Salesforce Tooling API Service
 * Handles: Fetch, Toggle (Active/Inactive), Deploy validation rules
 */

// ─── FETCH ALL VALIDATION RULES ON ACCOUNT OBJECT ────────────────────────────
export async function fetchValidationRules(instanceUrl, token) {
  const query = encodeURIComponent(
    `SELECT Id, ValidationName, Active, Description, ErrorMessage, ErrorDisplayField
     FROM ValidationRule
     WHERE EntityDefinition.QualifiedApiName = 'Account'
     ORDER BY ValidationName ASC`
  );

  const res = await fetch(
    `${instanceUrl}/services/data/v59.0/tooling/query?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err[0]?.message || "Failed to fetch validation rules");
  }

  const data = await res.json();
  return data.records || [];
}

// ─── TOGGLE SINGLE RULE ACTIVE/INACTIVE ───────────────────────────────────────
export async function toggleValidationRule(instanceUrl, token, ruleId, active) {
  const res = await fetch(
    `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Metadata: { active } }),
    }
  );

  if (!res.ok && res.status !== 204) {
    let errMsg = "Failed to update rule";
    try {
      const err = await res.json();
      errMsg = err[0]?.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  return true;
}

// ─── DEPLOY MULTIPLE RULES AT ONCE ────────────────────────────────────────────
export async function deployRules(instanceUrl, token, rules) {
  const results = [];

  for (const rule of rules) {
    try {
      await toggleValidationRule(instanceUrl, token, rule.Id, rule.Active);
      results.push({ id: rule.Id, name: rule.ValidationName, success: true });
    } catch (err) {
      results.push({
        id: rule.Id,
        name: rule.ValidationName,
        success: false,
        error: err.message,
      });
    }
  }

  return results;
}

// ─── GET CURRENT USER INFO ────────────────────────────────────────────────────
export async function getUserInfo(instanceUrl, token) {
  const res = await fetch(`${instanceUrl}/services/oauth2/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}
