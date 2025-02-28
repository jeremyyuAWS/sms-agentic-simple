
import React from 'react';
import { ValidationResult } from './types';
import { Contact } from '@/lib/types';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

interface ValidationSummaryProps {
  validationResults: ValidationResult[];
  contacts: Contact[];
  headers: string[];
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  validationResults,
  contacts,
  headers
}) => {
  const validRows = validationResults.filter(r => r.valid).length;
  const invalidRows = validationResults.filter(r => !r.valid).length;
  const totalRows = validationResults.length;
  const successRate = Math.round((validRows / totalRows) * 100) || 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium text-lg">CSV Validation Results</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Validation success rate: {successRate}%</span>
          <span className="text-xs text-muted-foreground">{validRows} of {totalRows} rows valid</span>
        </div>
        <Progress value={successRate} className="h-2" />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <div>
            <div className="text-sm text-muted-foreground">Valid Rows</div>
            <div className="text-xl font-semibold text-green-600">{validRows}</div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <div className="text-sm text-muted-foreground">Invalid Rows</div>
            <div className="text-xl font-semibold text-red-600">{invalidRows}</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center">
          <FileText className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <div className="text-sm text-muted-foreground">Total Rows</div>
            <div className="text-xl font-semibold text-blue-600">{totalRows}</div>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="invalid-rows">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span>Invalid Rows ({invalidRows})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {invalidRows > 0 ? (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Row #</TableHead>
                      <TableHead className="w-[40%]">Errors</TableHead>
                      <TableHead>Raw Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults
                      .filter(result => !result.valid)
                      .map((result) => (
                        <TableRow key={result.rowIndex} className="bg-red-50/30">
                          <TableCell>{result.rowIndex}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm text-red-600">
                              {result.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-xs">
                            {result.rawData.join(', ')}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No invalid rows found</p>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="valid-rows">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Valid Rows ({validRows})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {validRows > 0 ? (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Row #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Other Fields</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults
                      .filter(result => result.valid)
                      .map((result) => {
                        // Find corresponding contact
                        const contactIndex = contacts.findIndex(c => 
                          c.id.includes(`-${result.rowIndex}`) || result.rawData.includes(c.name)
                        );
                        const contact = contactIndex !== -1 ? contacts[contactIndex] : null;
                        
                        return (
                          <TableRow key={result.rowIndex} className="bg-green-50/30">
                            <TableCell>{result.rowIndex}</TableCell>
                            <TableCell className="font-medium">{contact?.name || '-'}</TableCell>
                            <TableCell>{contact?.phoneNumber || '-'}</TableCell>
                            <TableCell className="font-mono text-xs truncate max-w-xs">
                              {contact ? 
                                Object.entries(contact)
                                  .filter(([key]) => !['id', 'name', 'phoneNumber'].includes(key))
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ') 
                                : '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No valid rows found</p>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="detected-headers">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
              <span>Detected CSV Headers ({headers.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {headers.map((header, index) => (
                <div key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                  {header}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default ValidationSummary;
